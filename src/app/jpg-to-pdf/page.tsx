import type { Metadata } from "next";

import { ImageToPdfWorkspace } from "@/components/image-to-pdf/ImageToPdfWorkspace";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { FAQSection } from "@/components/shared/FAQSection";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "JPG to PDF — Convert Images to PDF Online",
  description:
    "Convert JPG images to a single ordered PDF. No upload, everything happens in your browser.",
  alternates: { canonical: "https://pleasefixmypdf.com/jpg-to-pdf/" },
  openGraph: {
    title: "JPG to PDF — Convert Images to PDF Online",
    description:
      "Turn JPG images into a clean, multi-page PDF. Reorder pages before downloading. 100% in-browser.",
    url: "https://pleasefixmypdf.com/jpg-to-pdf/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Convert", url: "/converter" },
  { name: "JPG to PDF", url: "/jpg-to-pdf" },
];

const faqs = [
  {
    question: "Can I convert multiple JPGs to one PDF?",
    answer:
      "Yes. Add multiple JPG images, reorder them if you like, and they will be merged into a single PDF.",
  },
  {
    question: "Do my images get uploaded?",
    answer:
      "No. All conversions happen in your browser — your JPG files never leave your device.",
  },
];

const relatedTools = [
  { href: "/image-to-pdf", label: "Image to PDF" },
  { href: "/pdf-to-jpg", label: "PDF to JPG" },
  { href: "/pdf-to-png", label: "PDF to PNG" },
];

export default function JpgToPdfPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ImageToPdfWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <FAQSection items={faqs} />
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}

