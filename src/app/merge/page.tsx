import type { Metadata } from "next";

import { MergeWorkspace } from "@/components/merge/MergeWorkspace";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { FAQSection } from "@/components/shared/FAQSection";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "Merge PDF Online — Combine PDF Files",
  description:
    "Combine multiple PDFs into one document in your browser. Private, no upload. Merge PDFs with full control over order.",
  alternates: { canonical: "https://pleasefixmypdf.com/merge/" },
  openGraph: {
    title: "Merge PDF Online — Combine PDF Files",
    description:
      "Combine multiple PDFs into one document in your browser. Private, no upload. Merge PDFs with full control over order.",
    url: "https://pleasefixmypdf.com/merge/",
  },
};

const mergeFaq = [
  {
    question: "Is it safe to merge PDFs online?",
    answer:
      "Yes — PleaseFixMyPDF processes everything in your browser. Your files are never uploaded to any server.",
  },
  {
    question: "How many PDFs can I merge at once?",
    answer: "You can merge as many files as your browser can handle. Limits depend on your plan.",
  },
  {
    question: "Can I merge password-protected PDFs?",
    answer:
      "At the moment, password-protected PDFs are not supported. Remove the password first, then merge the unlocked files.",
  },
  {
    question: "Can I reorder pages while merging PDFs?",
    answer:
      "Yes. After you add your files in the Merge PDF tool, you can drag pages into the exact order you want before downloading the final document.",
  },
  {
    question: "Does merging PDFs reduce quality?",
    answer:
      "No. Merging PDFs simply combines the pages into one document. Your text and images stay at the same quality as the originals.",
  },
  {
    question: "Can I merge PDFs on my phone or tablet?",
    answer:
      "Yes. PleaseFixMyPDF runs in your browser, so you can merge PDFs on desktop, laptop, or mobile devices that support modern browsers.",
  },
];

const relatedTools = [
  { href: "/compress", label: "Compress PDF" },
  { href: "/sign-pdf", label: "Sign PDF" },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Merge PDF", url: "/merge" },
];

export default function MergePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: mergeFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <MergeWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <FAQSection items={mergeFaq} />
        <RelatedTools tools={relatedTools} />
        <script
          type="application/ld+json"
          // FAQ schema for rich results
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </div>
    </>
  );
}
