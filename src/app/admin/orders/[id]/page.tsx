import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/format";
import type { Order, OrderItem, Profile } from "@/lib/types";

type OrderItemWithProduct = OrderItem & {
  products: { name: string } | null;
};

export default async function AdminOrderDetailPage({
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  if (!profile?.is_admin) {
    redirect("/account");
  }

  const admin = createAdminClient();

  const { data: order } = await admin
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle<Order>();

  if (!order) {
    notFound();
  }

  const { data: items } = await admin
    .from("order_items")
    .select("*, products(name)")
    .eq("order_id", id)
    .returns<OrderItemWithProduct[]>();

  const shipping = order.shipping_address as {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  } | null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/admin"
        className="text-sm text-neutral-500 underline hover:text-black active:font-semibold active:text-black"
      >
        ← Back to orders
      </Link>
      <h1 className="mt-4 mb-2 text-2xl font-bold">
        Order #{order.id.slice(0, 8)}
      </h1>
      <p className="mb-8 text-neutral-500">
        Placed {new Date(order.created_at).toLocaleDateString()} ·{" "}
        <span className="capitalize">{order.status}</span>
      </p>

      {shipping && (
        <div className="mb-8 rounded-lg border border-neutral-200 p-4 text-sm">
          <p className="mb-2 font-medium">Contact</p>
          <p className="text-neutral-500">
            {[shipping.firstName, shipping.lastName].filter(Boolean).join(" ")}
          </p>
          <p className="text-neutral-500">{shipping.email}</p>
          <p className="text-neutral-500">{shipping.phone}</p>
        </div>
      )}

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

      <div className="mt-6 space-y-2 border-t border-neutral-200 pt-6 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-neutral-500">Subtotal</span>
          <span>
            {formatPrice(
              order.total_cents + order.discount_cents - order.shipping_cents
            )}
          </span>
        </div>
        {order.discount_cents > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Discount</span>
            <span>−{formatPrice(order.discount_cents)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-neutral-500">Shipping</span>
          <span>
            {order.shipping_cents > 0
              ? formatPrice(order.shipping_cents)
              : "Free"}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-neutral-200 pt-2 text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.total_cents)}</span>
        </div>
      </div>
    </div>
  );
}
