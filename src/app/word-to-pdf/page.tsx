import type { Metadata } from "next";

import { ConvertWorkspace } from "@/components/convert/ConvertWorkspace";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "Word to PDF Free Online — Convert DOCX to PDF",
  description:
    "Convert Word documents to PDF instantly in your browser. Free, no upload, no signup. Works with DOCX files.",
  alternates: { canonical: "https://pleasefixmypdf.com/word-to-pdf/" },
  openGraph: {
    title: "Word to PDF Free Online — Convert DOCX to PDF",
    description:
      "Convert Word documents to PDF instantly in your browser. Free, no upload, no signup. Works with DOCX files.",
    url: "https://pleasefixmypdf.com/word-to-pdf/",
  },
};

export default function WordToPdfPage() {
  const relatedTools = [
    { href: "/pdf-to-word", label: "PDF to Word" },
    { href: "/merge", label: "Merge PDF" },
    { href: "/compress", label: "Compress PDF" },
  ];

  return (
    <>
      <ConvertWorkspace
        fixedMode="word-to-pdf"
        title="Convert Word to PDF Free"
        description="Convert Word documents to PDF in your browser. No uploads to servers."
      />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}
