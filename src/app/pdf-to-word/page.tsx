import type { Metadata } from "next";

import { ConvertWorkspace } from "@/components/convert/ConvertWorkspace";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "PDF to Word Free Online — Convert PDF to DOCX",
  description:
    "Convert PDF to editable Word document free. Extract text from PDF to DOCX in your browser. No upload required.",
  alternates: { canonical: "https://pleasefixmypdf.com/pdf-to-word/" },
  openGraph: {
    title: "PDF to Word Free Online — Convert PDF to DOCX",
    description:
      "Convert PDF to editable Word document free. Extract text from PDF to DOCX in your browser. No upload required.",
    url: "https://pleasefixmypdf.com/pdf-to-word/",
  },
};

export default function PdfToWordPage() {
  const relatedTools = [
    { href: "/word-to-pdf", label: "Word to PDF" },
    { href: "/split", label: "Split PDF" },
    { href: "/compress", label: "Compress PDF" },
  ];

  return (
    <>
      <ConvertWorkspace
        fixedMode="pdf-to-word"
        title="Convert PDF to Word Free"
        description="Turn PDF files into editable Word documents. 100% in your browser—no uploads."
      />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}
