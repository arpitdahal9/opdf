import type { Metadata } from "next";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { FAQSection } from "@/components/shared/FAQSection";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { SplitRangeWorkspace } from "@/components/split/SplitRangeWorkspace";

export const metadata: Metadata = {
  title: "Extract PDF Pages Online — Export Selected Pages | PleaseFixMyPDF",
  description:
    "Extract specific pages from a PDF in your browser. Select pages or ranges, then download privately. No upload.",
  alternates: { canonical: "https://pleasefixmypdf.com/extract-pdf-pages/" },
  openGraph: {
    title: "Extract PDF Pages Online — Export Selected Pages | PleaseFixMyPDF",
    description:
      "Extract specific pages from a PDF in your browser. Select pages or ranges, then download privately. No upload.",
    url: "https://pleasefixmypdf.com/extract-pdf-pages/",
  },
};

const splitFaq = [
  {
    question: "How do I extract pages from a PDF?",
    answer:
      "Open the Extract PDF Pages tool, upload your PDF, select the pages you want (or enter ranges), then download the extracted PDF.",
  },
  {
    question: "Can I extract a range of pages?",
    answer:
      "Yes. You can select pages individually or switch to range mode and enter formats like `1-5, 8, 12-15`.",
  },
  {
    question: "Does this upload my document to a server?",
    answer:
      "No. Everything runs in your browser, so your PDF stays private and never gets uploaded.",
  },
];

const relatedTools = [
  { href: "/merge", label: "Merge PDF" },
  { href: "/reorder", label: "Reorder PDF" },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Extract PDF Pages", url: "/extract-pdf-pages" },
];

export default function ExtractPdfPagesPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <SplitRangeWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <FAQSection items={splitFaq} />
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}

