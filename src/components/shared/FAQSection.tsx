"use client";

export type FAQItem = {
  question: string;
  answer: string;
};

function faqToJsonLd(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function FAQSection({ items }: { items: FAQItem[] }) {
  if (!items.length) return null;

  return (
    <section className="space-y-6 border-t border-border pt-10 dark:border-gray-700" aria-label="FAQ">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqToJsonLd(items)) }}
      />
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Frequently asked questions</h2>
      <dl className="space-y-6">
        {items.map((item) => (
          <div key={item.question}>
            <dt className="font-semibold text-gray-900 dark:text-white">{item.question}</dt>
            <dd className="mt-1 text-gray-600 dark:text-gray-400">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
