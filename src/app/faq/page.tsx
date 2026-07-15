const faqs = [
  {
    question: "What sizes do you carry?",
    answer:
      "Our pieces run S, M, L, and XL. Check the size selector on each product page for current availability.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept card payments in EGP through Paymob's secure checkout.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Orders within Egypt typically arrive in 3-5 business days. See our Shipping & Returns page for details.",
  },
  {
    question: "Can I return or exchange an item?",
    answer:
      "Yes, unworn items with tags attached can be returned within 14 days of delivery. See our Shipping & Returns page for the full policy.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once you're signed in, you can view your order history and status under My Account.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-8 text-2xl font-bold">FAQ</h1>
      <dl className="space-y-8">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <dt className="font-medium">{faq.question}</dt>
            <dd className="mt-1 text-sm text-neutral-400">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
