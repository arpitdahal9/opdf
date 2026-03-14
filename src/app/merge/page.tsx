import type { Metadata } from "next";

import { MergeWorkspace } from "@/components/merge/MergeWorkspace";
import { FAQSection } from "@/components/shared/FAQSection";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "Merge PDF Free Online — Combine PDF Files, No Signup",
  description:
    "Free PDF merger — combine multiple PDFs into one document in your browser. No upload, no signup, no watermark.",
  alternates: { canonical: "https://pleasefixmypdf.com/merge/" },
  openGraph: {
    title: "Merge PDF Free Online — Combine PDF Files, No Signup",
    description:
      "Free PDF merger — combine multiple PDFs into one document in your browser. No upload, no signup, no watermark.",
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
    answer: "There is no limit. You can merge as many files as your browser can handle.",
  },
  {
    question: "Is the PDF merger really free?",
    answer:
      "100% free. No signup, no watermark, no hidden limits. Unlimited merges, forever.",
  },
];

const relatedTools = [
  { href: "/reorder", label: "Reorder PDF" },
  { href: "/split", label: "Split PDF" },
  { href: "/compress", label: "Compress PDF" },
];

export default function MergePage() {
  return (
    <>
      <MergeWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <FAQSection items={mergeFaq} />
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}
