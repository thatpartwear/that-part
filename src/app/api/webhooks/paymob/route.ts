import { NextResponse } from "next/server";
import { verifyTransactionHmac, type PaymobTransactionObj } from "@/lib/paymob";
import { createAdminClient } from "@/lib/supabase/admin";

// Paymob's "Transaction Processed Callback" — configure this URL in the Paymob
// dashboard (Payment Integrations -> your integration -> Transaction callback).
export async function POST(request: Request) {
  const url = new URL(request.url);
  const hmac = url.searchParams.get("hmac");
  if (!hmac) {
    return NextResponse.json({ error: "Missing hmac" }, { status: 400 });
  }

  const body = (await request.json()) as {
    type: string;
    obj: PaymobTransactionObj;
  };

  if (body.type !== "TRANSACTION") {
    return NextResponse.json({ received: true });
  }

  if (!verifyTransactionHmac(body.obj, hmac)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const admin = createAdminClient();
  const paymobOrderId = String(body.obj.order.id);

  const { data: order } = await admin
    .from("orders")
    .select("id, status")
    .eq("paymob_order_id", paymobOrderId)
    .maybeSingle();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const newStatus = body.obj.success ? "paid" : "failed";

  // Idempotent: only act the first time this order transitions to paid.
  if (order.status !== "paid" && newStatus === "paid") {
    const { data: orderItems } = await admin
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", order.id);

    for (const item of orderItems ?? []) {
      if (item.product_id) {
        await admin.rpc("decrement_product_stock", {
          product_id: item.product_id,
          amount: item.quantity,
        });
      }
    }
  }

  await admin.from("orders").update({ status: newStatus }).eq("id", order.id);

  return NextResponse.json({ received: true });
}
