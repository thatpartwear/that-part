export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="mb-4 text-2xl font-bold">Contact us</h1>
      <p className="text-neutral-400">
        Have a question about an order, sizing, or anything else? Reach out
        and we&apos;ll get back to you as soon as we can.
      </p>

      <dl className="mt-8 space-y-4 text-sm">
        <div>
          <dt className="font-medium">Email</dt>
          <dd className="mt-1">
            <a
              href="mailto:support@thatpartwear.com"
              className="text-neutral-400 underline hover:text-white"
            >
              support@thatpartwear.com
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-medium">Phone</dt>
          <dd className="mt-1">
            <a
              href="tel:+201026229223"
              className="text-neutral-400 underline hover:text-white"
            >
              01026229223
            </a>
          </dd>
        </div>
      </dl>
    </div>
  );
}
