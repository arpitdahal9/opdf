import type { Metadata } from "next";

import { SplitWorkspace } from "@/components/split/SplitWorkspace";
import { FAQSection } from "@/components/shared/FAQSection";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "Split PDF Free Online — Extract Pages from PDF",
  description:
    "Split PDF files and extract pages instantly. Select specific pages or use ranges. Free, private, in your browser.",
  alternates: { canonical: "https://pleasefixmypdf.com/split/" },
  openGraph: {
    title: "Split PDF Free Online — Extract Pages from PDF",
    description:
      "Split PDF files and extract pages instantly. Select specific pages or use ranges. Free, private, in your browser.",
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
];

const relatedTools = [
  { href: "/merge", label: "Merge PDF" },
  { href: "/rotate", label: "Rotate PDF" },
  { href: "/reorder", label: "Reorder PDF" },
];

export default function SplitPage() {
  return (
    <>
      <SplitWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <FAQSection items={splitFaq} />
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}
