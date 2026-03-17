import type { Metadata } from "next";

import { ImageToPdfWorkspace } from "@/components/image-to-pdf/ImageToPdfWorkspace";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { FAQSection } from "@/components/shared/FAQSection";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "PNG to PDF — Convert PNG Images to PDF Online",
  description:
    "Convert PNG images to a single PDF. Preserve transparency where supported, reorder pages, and download instantly.",
  alternates: { canonical: "https://pleasefixmypdf.com/png-to-pdf/" },
  openGraph: {
    title: "PNG to PDF — Convert PNG Images to PDF Online",
    description:
      "Turn one or many PNG images into a clean, ordered PDF. Everything runs locally in your browser.",
    url: "https://pleasefixmypdf.com/png-to-pdf/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Convert", url: "/converter" },
  { name: "PNG to PDF", url: "/png-to-pdf" },
];

const faqs = [
  {
    question: "Can I combine multiple PNGs into one PDF?",
    answer:
      "Yes. Drop in multiple PNG files and we will merge them into a single, ordered PDF document.",
  },
  {
    question: "Is PNG to PDF conversion private?",
    answer:
      "Yes. All processing happens in your browser and your PNG images are never uploaded.",
  },
];

const relatedTools = [
  { href: "/image-to-pdf", label: "Image to PDF" },
  { href: "/pdf-to-jpg", label: "PDF to JPG" },
  { href: "/pdf-to-png", label: "PDF to PNG" },
];

export default function PngToPdfPage() {
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

