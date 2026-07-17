import Link from "next/link";
import { ClearCartOnLoad } from "@/components/ClearCartOnLoad";

// Paymob redirects the browser here after checkout (configure this URL as the
// "Transaction Response Callback" in the Paymob dashboard). This page is
// display-only — the authoritative order status is written by the webhook at
// /api/webhooks/paymob, since this redirect can be skipped, retried, or spoofed.
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const paid = success === "true";

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      {paid && <ClearCartOnLoad />}
      <h1 className="text-2xl font-bold">
        {paid ? "Thank you for your order!" : "Payment not completed"}
      </h1>
      <p className="mt-4 text-neutral-600">
        {paid
          ? "Your payment was received. A confirmation will follow shortly."
          : "Your payment didn't go through. Your cart is still saved — you can try again."}
      </p>
      <div className="mt-8 flex justify-center gap-4">
        {paid ? (
          <Link
            href="/account"
            className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white"
          >
            View orders
          </Link>
        ) : (
          <Link
            href="/cart"
            className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white"
          >
            Back to cart
          </Link>
        )}
        <Link
          href="/shop"
          className="rounded-md border border-neutral-300 px-6 py-3 text-sm font-medium"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
