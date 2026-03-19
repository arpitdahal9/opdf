import type { Metadata } from "next";

import { PdfToImageWorkspace } from "@/components/pdf-to-image/PdfToImageWorkspace";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { FAQSection } from "@/components/shared/FAQSection";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "PDF to JPG — Convert PDF Pages to Images Online",
  description:
    "Convert each PDF page to a JPG image. No upload, in your browser. Private and fast.",
  alternates: { canonical: "https://pleasefixmypdf.com/pdf-to-jpg/" },
  openGraph: {
    title: "PDF to JPG — Convert PDF Pages to Images Online",
    description:
      "Convert each PDF page to a JPG image. No upload, in your browser. Private and fast.",
    url: "https://pleasefixmypdf.com/pdf-to-jpg/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Convert", url: "/converter" },
  { name: "PDF to JPG", url: "/pdf-to-jpg" },
];

const faqs = [
  {
    question: "Is PDF to JPG conversion free?",
    answer:
      "Yes. PleaseFixMyPDF converts PDF pages to JPG in your browser without uploading files to any server.",
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

export default function PdfToJpgPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <PdfToImageWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <FAQSection items={faqs} />
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}
