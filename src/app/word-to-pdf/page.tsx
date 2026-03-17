import type { Metadata } from "next";

import { ConvertWorkspace } from "@/components/convert/ConvertWorkspace";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "Word to PDF Online — Convert DOCX to PDF",
  description:
    "Convert Word documents to PDF instantly in your browser. No upload. Works with DOCX files. Private conversion.",
  alternates: { canonical: "https://pleasefixmypdf.com/word-to-pdf/" },
  openGraph: {
    title: "Word to PDF Online — Convert DOCX to PDF",
    description:
      "Convert Word documents to PDF instantly in your browser. No upload. Works with DOCX files. Private conversion.",
    url: "https://pleasefixmypdf.com/word-to-pdf/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Convert", url: "/converter" },
  { name: "Word to PDF", url: "/word-to-pdf" },
];

export default function WordToPdfPage() {
  const relatedTools = [
    { href: "/pdf-to-word", label: "PDF to Word" },
    { href: "/merge", label: "Merge PDF" },
    { href: "/compress", label: "Compress PDF" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ConvertWorkspace
        fixedMode="word-to-pdf"
        title="Convert Word to PDF"
        description="Convert Word documents to PDF in your browser. No uploads to servers."
      />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}
