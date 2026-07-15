export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-2xl font-bold">Privacy Policy</h1>
      <p className="mb-8 text-sm text-neutral-500">Last updated: July 2026</p>

      <div className="space-y-8 text-sm text-neutral-600">
        <section>
          <h2 className="mb-2 text-base font-semibold text-black">
            1. What we collect
          </h2>
          <p>
            When you create an account, place an order, or contact us, we
            collect information such as your name, email address, phone
            number, shipping address, and order details.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-black">
            2. How we use it
          </h2>
          <p>
            We use this information to process and deliver your orders,
            manage your account, respond to support requests, and improve
            our service. We don&apos;t sell your personal information.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-black">
            3. Payment information
          </h2>
          <p>
            Payments are processed by Paymob. We don&apos;t store your card
            details ourselves — they&apos;re handled directly by Paymob under
            its own security and privacy practices.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-black">
            4. Service providers
          </h2>
          <p>
            We use Supabase to store account and order data, and Paymob to
            process payments. These providers only access what&apos;s needed
            to perform their service for us.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-black">
            5. Cookies and local storage
          </h2>
          <p>
            We use your browser&apos;s local storage to remember your cart
            contents and session cookies to keep you signed in. We don&apos;t
            use tracking or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-black">
            6. Your rights
          </h2>
          <p>
            You can request access to, correction of, or deletion of your
            personal data at any time by contacting us. You can also delete
            your account from your account settings.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-black">
            7. Contact
          </h2>
          <p>
            Questions about this policy or your data? Reach us at{" "}
            <a href="mailto:support@thatpartwear.com" className="underline">
              support@thatpartwear.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
