import type { Metadata } from "next";

import { ConvertWorkspace } from "@/components/convert/ConvertWorkspace";

export const metadata: Metadata = {
  title: "Word to PDF — Convert DOCX to PDF Free Online | PleaseFixMyPDF.com",
  description:
    "Convert Word documents to PDF instantly. 100% browser-based, no uploads. Free and private.",
  alternates: { canonical: "/word-to-pdf" },
  openGraph: {
    title: "Word to PDF — Convert DOCX to PDF Free Online | PleaseFixMyPDF.com",
    description:
      "Convert Word documents to PDF instantly. 100% browser-based, no uploads. Free and private.",
    url: "/word-to-pdf",
  },
};

export default function WordToPdfPage() {
  return (
    <ConvertWorkspace
      fixedMode="word-to-pdf"
      title="Word to PDF Converter"
      description="Convert Word documents to PDF in your browser. No uploads to servers."
    />
  );
}
