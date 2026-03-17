import type { Metadata } from "next";

import { PdfTextWorkspace } from "@/components/text/PdfTextWorkspace";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { FAQSection } from "@/components/shared/FAQSection";

export const metadata: Metadata = {
  title: "PDF to Text — Extract and Convert Text in Your Browser",
  description:
    "Extract text from PDF files or turn plain text into a simple PDF. Everything runs in your browser with pdf.js and pdf-lib.",
  alternates: { canonical: "https://pleasefixmypdf.com/pdf-to-text/" },
  openGraph: {
    title: "PDF to Text — Extract and Convert Text in Your Browser",
    description:
      "Convert PDF to text or text back to PDF without uploads. Powered by pdf.js and pdf-lib, private and fast.",
    url: "https://pleasefixmypdf.com/pdf-to-text/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Convert", url: "/converter" },
  { name: "PDF to Text", url: "/pdf-to-text" },
];

const faqs = [
  {
    question: "Does this work offline or without uploads?",
    answer:
      "Yes. Both PDF to text and text to PDF conversions run entirely in your browser using pdf.js and pdf-lib. Your files never leave your device.",
  },
  {
    question: "Will this preserve complex layouts?",
    answer:
      "This tool focuses on extracting and generating plain text. Complex layouts, tables, or forms may not be preserved visually, but the text content remains.",
  },
];

export default function PdfToTextPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <PdfTextWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <FAQSection items={faqs} />
      </div>
    </>
  );
}

