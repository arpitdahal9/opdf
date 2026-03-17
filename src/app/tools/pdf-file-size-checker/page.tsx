import type { Metadata } from "next";

import { PdfFileSizeCheckerTool } from "@/components/tools/PdfFileSizeCheckerTool";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "PDF file size checker — Check PDF size online | PleaseFixMyPDF",
  description: "Check the file size of any PDF. Free, private, no upload to servers.",
  alternates: { canonical: "https://pleasefixmypdf.com/tools/pdf-file-size-checker/" },
  openGraph: {
    title: "PDF file size checker — Check PDF size online | PleaseFixMyPDF",
    description: "Check the file size of any PDF. Free, private, no upload to servers.",
    url: "https://pleasefixmypdf.com/tools/pdf-file-size-checker/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
  { name: "PDF file size checker", url: "/tools/pdf-file-size-checker" },
];

export default function PdfFileSizeCheckerPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap mx-auto max-w-2xl space-y-6 px-4 pb-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PDF file size checker</h1>
          <p className="text-gray-600 dark:text-slate-300">
            Select a PDF to see its file size. No upload to servers — runs in your browser.
          </p>
        </header>
        <PdfFileSizeCheckerTool />
      </div>
    </>
  );
}
