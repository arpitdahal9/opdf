import type { Metadata } from "next";

import { ConvertWorkspace } from "@/components/convert/ConvertWorkspace";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "PDF to Word Online — Convert PDF to DOCX",
  description:
    "Convert PDF to editable Word document. Extract text from PDF to DOCX in your browser. No upload required. Private.",
  alternates: { canonical: "https://pleasefixmypdf.com/pdf-to-word/" },
  openGraph: {
    title: "PDF to Word Online — Convert PDF to DOCX",
    description:
      "Convert PDF to editable Word document. Extract text from PDF to DOCX in your browser. No upload required. Private.",
    url: "https://pleasefixmypdf.com/pdf-to-word/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Convert", url: "/converter" },
  { name: "PDF to Word", url: "/pdf-to-word" },
];

export default function PdfToWordPage() {
  const relatedTools = [
    { href: "/word-to-pdf", label: "Word to PDF" },
    { href: "/split", label: "Split PDF" },
    { href: "/compress", label: "Compress PDF" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ConvertWorkspace
        fixedMode="pdf-to-word"
        title="Convert PDF to Word"
        description="Turn PDF files into editable Word documents. 100% in your browser—no uploads."
      />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}
