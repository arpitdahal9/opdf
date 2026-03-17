import type { Metadata } from "next";

import { PdfMetadataViewerTool } from "@/components/tools/PdfMetadataViewerTool";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "PDF metadata viewer — View PDF properties | PleaseFixMyPDF",
  description:
    "View PDF metadata: title, author, page count, creation date. No upload — runs in your browser.",
  alternates: { canonical: "https://pleasefixmypdf.com/tools/pdf-metadata-viewer/" },
  openGraph: {
    title: "PDF metadata viewer — View PDF properties | PleaseFixMyPDF",
    description: "View PDF metadata: title, author, page count, creation date. No upload — runs in your browser.",
    url: "https://pleasefixmypdf.com/tools/pdf-metadata-viewer/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
  { name: "PDF metadata viewer", url: "/tools/pdf-metadata-viewer" },
];

export default function PdfMetadataViewerPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap mx-auto max-w-2xl space-y-6 px-4 pb-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PDF metadata viewer</h1>
          <p className="text-gray-600 dark:text-slate-300">
            View title, author, page count, and other PDF properties. No upload to servers.
          </p>
        </header>
        <PdfMetadataViewerTool />
      </div>
    </>
  );
}
