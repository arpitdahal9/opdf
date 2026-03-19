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
      "There is no hard server-side limit because compression runs in your browser. Very large files may still be limited by your device memory and browser.",
  },
  {
    question: "Will compressing a PDF reduce image quality?",
    answer:
      "Compression usually reduces image size by lowering resolution or quality. Text remains sharp, but highly compressed PDFs can show some softness in photos or scans.",
  },
  {
    question: "Can I compress a PDF for email?",
    answer:
      "Yes. Use the Compress PDF tool to create a smaller version of your PDF that is easier to send via email or upload to portals.",
  },
  {
    question: "Does compression affect the original PDF?",
    answer:
      "No. Compression creates a new optimised PDF for download. Your original file stays on your device unchanged.",
  },
];

const relatedTools = [
  { href: "/merge", label: "Merge PDF" },
  {
    href: "mailto:?subject=Compressed%20PDF",
    label: "Email your PDF",
  },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Compress PDF", url: "/compress" },
];

export default function CompressPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: compressFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <CompressWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <FAQSection items={compressFaq} />
        <RelatedTools tools={relatedTools} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </div>
    </>
  );
}

