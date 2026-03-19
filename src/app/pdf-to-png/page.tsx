import type { Metadata } from "next";

import { PdfToPngWorkspace } from "@/components/pdf-to-image/PdfToPngWorkspace";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { FAQSection } from "@/components/shared/FAQSection";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "PDF to PNG — Convert PDF Pages to Images Online",
  description:
    "Convert each PDF page to a high-quality PNG image. No upload, in your browser. Private and fast.",
  alternates: { canonical: "https://pleasefixmypdf.com/pdf-to-png/" },
  openGraph: {
    title: "PDF to PNG — Convert PDF Pages to Images Online",
    description:
      "Convert each PDF page to a high-quality PNG image. No upload, in your browser. Private and fast.",
    url: "https://pleasefixmypdf.com/pdf-to-png/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Convert", url: "/converter" },
  { name: "PDF to PNG", url: "/pdf-to-png" },
];

const faqs = [
  {
    question: "Is PDF to PNG conversion free?",
    answer:
      "Yes. PleaseFixMyPDF converts PDF pages to PNG in your browser without uploading files to any server.",
  },
  {
    question: "Do my files get uploaded to a server?",
    answer:
      "No. All conversion runs in your browser. Your PDF never leaves your device.",
  },
];

const relatedTools = [
  { href: "/image-to-pdf", label: "Image to PDF" },
  { href: "/merge", label: "Merge PDF" },
  { href: "/compress", label: "Compress PDF" },
];

export default function PdfToPngPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <PdfToPngWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <FAQSection items={faqs} />
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}

