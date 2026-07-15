export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-2xl font-bold">Terms of Service</h1>
      <p className="mb-8 text-sm text-neutral-500">Last updated: July 2026</p>

      <div className="space-y-8 text-sm text-neutral-600">
        <section>
          <h2 className="mb-2 text-base font-semibold text-black">
            1. About these terms
          </h2>
          <p>
            These Terms of Service govern your use of the THAT PART website
            and your purchase of products from us. By placing an order or
            creating an account, you agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-black">
            2. Orders and payment
          </h2>
          <p>
            All prices are listed in Egyptian Pounds (EGP) and include
            applicable taxes unless stated otherwise. Payments are processed
            securely through Paymob. We reserve the right to cancel or refuse
            any order, including in cases of pricing errors, suspected fraud,
            or stock unavailability.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-black">
            3. Shipping and returns
          </h2>
          <p>
            Shipping timelines and our returns policy are described on our{" "}
            <a href="/shipping-returns" className="underline">
              Shipping &amp; Returns
            </a>{" "}
            page, which forms part of these terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-black">
            4. Accounts
          </h2>
          <p>
            You&apos;re responsible for keeping your account credentials
            secure and for all activity under your account. Let us know
            immediately if you suspect unauthorized use.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-black">
            5. Acceptable use
          </h2>
          <p>
            You agree not to misuse the site — including attempting to
            disrupt it, access it using automated means without permission,
            or use it for any unlawful purpose.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-black">
            6. Limitation of liability
          </h2>
          <p>
            THAT PART is not liable for indirect or consequential losses
            arising from your use of the site or products purchased through
            it, to the fullest extent permitted by law.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-black">
            7. Changes to these terms
          </h2>
          <p>
            We may update these terms from time to time. Continued use of the
            site after changes take effect means you accept the updated
            terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-black">
            8. Contact
          </h2>
          <p>
            Questions about these terms? Reach us at{" "}
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
