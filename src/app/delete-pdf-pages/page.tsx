import type { Metadata } from "next";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { FAQSection } from "@/components/shared/FAQSection";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { SplitWorkspace } from "@/components/split/SplitWorkspace";

export const metadata: Metadata = {
  title: "Delete PDF Pages Online — Remove Pages from PDF | PleaseFixMyPDF",
  description:
    "Delete unwanted pages from a PDF in your browser. Click the X on pages you want to remove, then download privately. No upload.",
  alternates: { canonical: "https://pleasefixmypdf.com/delete-pdf-pages/" },
  openGraph: {
    title: "Delete PDF Pages Online — Remove Pages from PDF | PleaseFixMyPDF",
    description:
      "Delete unwanted pages from a PDF in your browser. Click the X on pages you want to remove, then download privately. No upload.",
    url: "https://pleasefixmypdf.com/delete-pdf-pages/",
  },
};

const deleteFaq = [
  {
    question: "How do I delete pages from a PDF?",
    answer:
      "Open the Delete PDF Pages tool, upload your PDF, remove unwanted pages with the X button, and download the remaining PDF.",
  },
  {
    question: "Can I delete multiple pages at once?",
    answer:
      "Yes. Just click the X on each page you want to remove. The remaining pages are kept in your download.",
  },
  {
    question: "Does this change my original file?",
    answer:
      "No. The deletion happens in your browser. Your downloaded PDF is a new file; your original stays on your device.",
  },
];

const relatedTools = [
  { href: "/merge", label: "Merge PDF" },
  { href: "/reorder", label: "Reorder PDF" },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Delete PDF Pages", url: "/delete-pdf-pages" },
];

export default function DeletePdfPagesPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <SplitWorkspace variant="delete" />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <FAQSection items={deleteFaq} />
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}

