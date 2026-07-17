import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/format";
import type { Order, Profile } from "@/lib/types";

export default async function AdminOrdersPage() {
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
  const { data: orders } = await admin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Order[]>();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Orders</h1>

      {orders && orders.length > 0 ? (
        <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between px-4 py-4 hover:bg-neutral-50"
              >
                <div>
                  <p className="font-medium">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {new Date(order.created_at).toLocaleDateString()} ·{" "}
                    {order.email ?? "no email"} ·{" "}
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
        <p className="text-neutral-500">No orders yet.</p>
      )}
    </div>
  );
}
