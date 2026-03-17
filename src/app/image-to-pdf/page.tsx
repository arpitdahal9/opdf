import type { Metadata } from "next";

import { ImageToPdfWorkspace } from "@/components/image-to-pdf/ImageToPdfWorkspace";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { FAQSection } from "@/components/shared/FAQSection";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "Image to PDF — Convert JPG, PNG, Photo to PDF",
  description:
    "Convert JPG, PNG, or photos to PDF. Combine multiple images into one PDF. No upload, in your browser. Private.",
  alternates: { canonical: "https://pleasefixmypdf.com/image-to-pdf/" },
  openGraph: {
    title: "Image to PDF — Convert JPG, PNG, Photo to PDF",
    description:
      "Convert JPG, PNG, or photos to PDF. Combine multiple images into one PDF. No upload, in your browser. Private.",
    url: "https://pleasefixmypdf.com/image-to-pdf/",
  },
};

const imageToPdfFaq = [
  {
    question: "How do I convert JPG to PDF?",
    answer:
      "Drag and drop your JPG, PNG or other images. Arrange them in order and click download to get a single PDF.",
  },
  {
    question: "Can I combine multiple photos into one PDF?",
    answer:
      "Yes — add as many images as you like, reorder them with drag and drop, then download as one PDF.",
  },
];

const relatedTools = [
  { href: "/merge", label: "Merge PDF" },
  { href: "/compress", label: "Compress PDF" },
  { href: "/rotate", label: "Rotate PDF" },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Convert", url: "/converter" },
  { name: "Image to PDF", url: "/image-to-pdf" },
];

export default function ImageToPdfPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ImageToPdfWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <FAQSection items={imageToPdfFaq} />
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}

