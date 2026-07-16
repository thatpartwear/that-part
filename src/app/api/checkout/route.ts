import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getAuthToken,
  createOrder,
  createPaymentKey,
  getIframeUrl,
} from "@/lib/paymob";
import { calculatePricing } from "@/lib/pricing";
import type { CartItem, Product, Profile } from "@/lib/types";

type Contact = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export async function POST(request: Request) {
  const { items, contact } = (await request.json()) as {
    items: CartItem[];
    contact: Contact;
  };

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (!contact?.firstName || !contact?.lastName || !contact?.email || !contact?.phone) {
    return NextResponse.json(
      { error: "First name, last name, email, and phone are required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const productIds = Array.from(new Set(items.map((i) => i.productId)));
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds)
    .returns<Product[]>();

  const productsById = new Map((products ?? []).map((p) => [p.id, p]));

  let subtotalCents = 0;
  const paymobItems = [];
  const orderItemRows = [];

  for (const item of items) {
    const product = productsById.get(item.productId);
    if (!product) {
      return NextResponse.json(
        { error: `Product ${item.productId} not found` },
        { status: 400 }
      );
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `${product.name} is out of stock` },
        { status: 400 }
      );
    }

    subtotalCents += product.price_cents * item.quantity;

    paymobItems.push({
      name: product.name,
      amount_cents: String(product.price_cents),
      description: product.description ?? product.name,
      quantity: String(item.quantity),
    });

    orderItemRows.push({
      product_id: product.id,
      quantity: item.quantity,
      price_cents: product.price_cents,
      size: item.size,
      color: item.color,
    });
  }

  let memberDiscountEligible = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle<Profile>();
    memberDiscountEligible = profile?.marketing_opt_in ?? false;
  }

  const pricing = calculatePricing({
    subtotalCents,
    isMemberDiscountEligible: memberDiscountEligible,
  });

  if (pricing.shippingCents > 0) {
    paymobItems.push({
      name: "Shipping",
      amount_cents: String(pricing.shippingCents),
      description: "Shipping",
      quantity: "1",
    });
  }

  const admin = createAdminClient();

  let authToken: string;
  let paymobOrderId: number;
  try {
    authToken = await getAuthToken();
    paymobOrderId = await createOrder(authToken, pricing.totalCents, paymobItems);
  } catch (err) {
    console.error("Paymob order creation failed:", err);
    return NextResponse.json(
      { error: "Payment provider is unavailable right now. Please try again shortly." },
      { status: 502 }
    );
  }

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      paymob_order_id: String(paymobOrderId),
      status: "pending",
      total_cents: pricing.totalCents,
      discount_cents: pricing.discountCents,
      shipping_cents: pricing.shippingCents,
      email: contact.email,
      shipping_address: contact,
    })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  const { error: itemsError } = await admin
    .from("order_items")
    .insert(orderItemRows.map((row) => ({ ...row, order_id: order.id })));

  if (itemsError) {
    return NextResponse.json(
      { error: "Failed to create order items" },
      { status: 500 }
    );
  }

  let paymentToken: string;
  try {
    paymentToken = await createPaymentKey(authToken, pricing.totalCents, paymobOrderId, {
      first_name: contact.firstName,
      last_name: contact.lastName,
      email: contact.email,
      phone_number: contact.phone,
    });
  } catch (err) {
    console.error("Paymob payment key creation failed:", err);
    return NextResponse.json(
      { error: "Payment provider is unavailable right now. Please try again shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ url: getIframeUrl(paymentToken) });
}
