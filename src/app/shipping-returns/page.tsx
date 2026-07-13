export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-8 text-2xl font-bold">Shipping & Returns</h1>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold">Shipping</h2>
        <p className="text-sm text-neutral-600">
          We currently ship within Egypt. Orders are processed within 1-2
          business days and typically arrive within 3-5 business days,
          depending on your location. Shipping costs are calculated at
          checkout.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Returns</h2>
        <p className="text-sm text-neutral-600">
          If something isn&apos;t right, you can return unworn items with
          tags attached within 14 days of delivery for a refund or exchange.
          Contact us to start a return.
        </p>
      </section>
    </div>
  );
}
