import type { Metadata } from "next";

import { PdfPageCounterTool } from "@/components/tools/PdfPageCounterTool";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "PDF page counter — Count pages in any PDF | PleaseFixMyPDF",
  description:
    "Upload a PDF to see how many pages it has. Free, private, no upload to servers.",
  alternates: { canonical: "https://pleasefixmypdf.com/tools/pdf-page-counter/" },
  openGraph: {
    title: "PDF page counter — Count pages in any PDF | PleaseFixMyPDF",
    description: "Upload a PDF to see how many pages it has. Free, private, no upload to servers.",
    url: "https://pleasefixmypdf.com/tools/pdf-page-counter/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
  { name: "PDF page counter", url: "/tools/pdf-page-counter" },
];

export default function PdfPageCounterPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap mx-auto max-w-2xl space-y-6 px-4 pb-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PDF page counter</h1>
          <p className="text-gray-600 dark:text-slate-300">
            Upload a PDF to see how many pages it has. No upload to servers — runs in your browser.
          </p>
        </header>
        <PdfPageCounterTool />
      </div>
    </>
  );
}
