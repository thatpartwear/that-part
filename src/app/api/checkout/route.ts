import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getAuthToken,
  createOrder,
  createPaymentKey,
  getIframeUrl,
} from "@/lib/paymob";
import type { CartItem, Product } from "@/lib/types";

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

  let totalCents = 0;
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

    totalCents += product.price_cents * item.quantity;

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

  const admin = createAdminClient();

  const authToken = await getAuthToken();
  const paymobOrderId = await createOrder(authToken, totalCents, paymobItems);

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      paymob_order_id: String(paymobOrderId),
      status: "pending",
      total_cents: totalCents,
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

  const paymentToken = await createPaymentKey(authToken, totalCents, paymobOrderId, {
    first_name: contact.firstName,
    last_name: contact.lastName,
    email: contact.email,
    phone_number: contact.phone,
  });

  return NextResponse.json({ url: getIframeUrl(paymentToken) });
}
