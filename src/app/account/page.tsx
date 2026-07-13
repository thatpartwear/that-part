import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Order[]>();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold">Your account</h1>
      <p className="mb-8 text-neutral-600">{user.email}</p>

      <h2 className="mb-4 text-lg font-semibold">Order history</h2>
      {orders && orders.length > 0 ? (
        <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between px-4 py-4 hover:bg-neutral-50"
              >
                <div>
                  <p className="font-medium">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {new Date(order.created_at).toLocaleDateString()} ·{" "}
                    <span className="capitalize">{order.status}</span>
                  </p>
                </div>
                <p className="font-medium">
                  {formatPrice(order.total_cents)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-neutral-500">
          No orders yet.{" "}
          <Link href="/shop" className="underline">
            Start shopping
          </Link>
          .
        </p>
      )}
    </div>
  );
}
