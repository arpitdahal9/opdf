import type { Metadata } from "next";

import { ConvertWorkspace } from "@/components/convert/ConvertWorkspace";

export const metadata: Metadata = {
  title: "PDF to Word — Convert PDF to DOCX Free Online | PleaseFixMyPDF.com",
  description:
    "Extract PDF text into an editable Word document. 100% browser-based, no uploads. Free and private.",
  alternates: { canonical: "/pdf-to-word" },
  openGraph: {
    title: "PDF to Word — Convert PDF to DOCX Free Online | PleaseFixMyPDF.com",
    description:
      "Extract PDF text into an editable Word document. 100% browser-based, no uploads. Free and private.",
    url: "/pdf-to-word",
  },
};

export default function PdfToWordPage() {
  return (
    <ConvertWorkspace
      fixedMode="pdf-to-word"
      title="PDF to Word Converter"
      description="Turn PDF files into editable Word documents. 100% in your browser—no uploads."
    />
  );
}
