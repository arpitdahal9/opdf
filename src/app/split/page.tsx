import type { Metadata } from "next";

import { SplitRangeWorkspace } from "@/components/split/SplitRangeWorkspace";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { FAQSection } from "@/components/shared/FAQSection";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "Split PDF Online — Extract Pages from PDF",
  description:
    "Split PDF files and extract pages instantly. Select specific pages or use ranges. Private, in your browser.",
  alternates: { canonical: "https://pleasefixmypdf.com/split/" },
  openGraph: {
    title: "Split PDF Online — Extract Pages from PDF",
    description:
      "Split PDF files and extract pages instantly. Select specific pages or use ranges. Private, in your browser.",
    url: "https://pleasefixmypdf.com/split/",
  },
};

const splitFaq = [
  {
    question: "How do I split a PDF into separate pages?",
    answer:
      "Upload your PDF, select the pages you want, and click download. Each selected page is extracted into a new PDF.",
  },
  {
    question: "Can I extract a range of pages from a PDF?",
    answer: "Yes — you can select individual pages or enter ranges like 1-5, 8, 12-15.",
  },
  {
    question: "Can I split a PDF into individual pages?",
    answer:
      "Yes. Use the Split PDF tool and choose to export each page as its own PDF, or select only the pages you need.",
  },
  {
    question: "Does splitting a PDF change the original file?",
    answer:
      "No. Splitting creates new PDF files based on the pages you choose. Your original PDF stays on your device unchanged.",
  },
  {
    question: "Can I split a password-protected PDF?",
    answer:
      "Currently, password-protected PDFs are not supported. Remove the password first, then upload the unlocked file to split it.",
  },
];

const relatedTools = [
  { href: "/merge", label: "Merge PDF" },
  { href: "/reorder", label: "Reorder PDF" },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Split PDF", url: "/split" },
];

export default function SplitPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: splitFaq.map((item) => ({
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
      <SplitRangeWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <FAQSection items={splitFaq} />
        <RelatedTools tools={relatedTools} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </div>
    </>
  );
}
