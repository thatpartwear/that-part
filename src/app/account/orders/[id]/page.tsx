import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import type { Order, OrderItem } from "@/lib/types";

type OrderItemWithProduct = OrderItem & {
  products: { name: string } | null;
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle<Order>();

  if (!order) {
    notFound();
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("*, products(name)")
    .eq("order_id", id)
    .returns<OrderItemWithProduct[]>();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/account" className="text-sm text-neutral-500 underline">
        ← Back to orders
      </Link>
      <h1 className="mt-4 mb-2 text-2xl font-bold">
        Order #{order.id.slice(0, 8)}
      </h1>
      <p className="mb-8 text-neutral-600">
        Placed {new Date(order.created_at).toLocaleDateString()} ·{" "}
        <span className="capitalize">{order.status}</span>
      </p>

      <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
        {(items ?? []).map((item) => (
          <li key={item.id} className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="font-medium">{item.products?.name ?? "Item"}</p>
              <p className="text-sm text-neutral-500">
                {[item.size, item.color].filter(Boolean).join(" / ")} · Qty{" "}
                {item.quantity}
              </p>
            </div>
            <p className="font-medium">
              {formatPrice(item.price_cents * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-6">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-lg font-semibold">
          {formatPrice(order.total_cents)}
        </span>
      </div>
    </div>
  );
}
