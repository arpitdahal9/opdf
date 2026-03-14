import type { Metadata } from "next";

import { CompressWorkspace } from "@/components/compress/CompressWorkspace";
import { FAQSection } from "@/components/shared/FAQSection";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "Compress PDF Free Online — Reduce PDF File Size",
  description:
    "Free PDF compressor — shrink PDF file size while keeping quality. No upload, no limits, works in your browser.",
  alternates: { canonical: "https://pleasefixmypdf.com/compress/" },
  openGraph: {
    title: "Compress PDF Free Online — Reduce PDF File Size",
    description:
      "Free PDF compressor — shrink PDF file size while keeping quality. No upload, no limits, works in your browser.",
    url: "https://pleasefixmypdf.com/compress/",
  },
};

const compressFaq = [
  {
    question: "How do I reduce PDF file size for free?",
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

export default function CompressPage() {
  return (
    <>
      <CompressWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <FAQSection items={compressFaq} />
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}

