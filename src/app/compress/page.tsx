import type { Metadata } from "next";

import { CompressWorkspace } from "@/components/compress/CompressWorkspace";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { FAQSection } from "@/components/shared/FAQSection";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "Compress PDF Online — Reduce PDF File Size",
  description:
    "Shrink PDF file size while keeping quality. No upload, works in your browser. Private PDF compression.",
  alternates: { canonical: "https://pleasefixmypdf.com/compress/" },
  openGraph: {
    title: "Compress PDF Online — Reduce PDF File Size",
    description:
      "Shrink PDF file size while keeping quality. No upload, works in your browser. Private PDF compression.",
    url: "https://pleasefixmypdf.com/compress/",
  },
};

const compressFaq = [
  {
    question: "How do I reduce PDF file size?",
    answer:
      "Upload your PDF to our compressor. It reduces file size by optimising images while keeping text quality.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "No server-side limits since everything runs in your browser. Performance depends on your device.",
  },
];

const relatedTools = [
  { href: "/merge", label: "Merge PDF" },
  { href: "/split", label: "Split PDF" },
  { href: "/image-to-pdf", label: "Image to PDF" },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Compress PDF", url: "/compress" },
];

export default function CompressPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <CompressWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <FAQSection items={compressFaq} />
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}

