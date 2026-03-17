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
];

const relatedTools = [
  { href: "/reorder", label: "Reorder PDF" },
  { href: "/split", label: "Split PDF" },
  { href: "/compress", label: "Compress PDF" },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Merge PDF", url: "/merge" },
];

export default function MergePage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <MergeWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <FAQSection items={mergeFaq} />
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}
