import type { Metadata } from "next";
import Link from "next/link";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "iLovePDF alternatives — Private PDF tools that don't upload your files | PleaseFixMyPDF",
  description:
    "Looking for an iLovePDF alternative? PleaseFixMyPDF runs in your browser — your files never leave your device.",
  alternates: { canonical: "https://pleasefixmypdf.com/alternatives/ilovepdf-alternatives/" },
  openGraph: {
    title: "iLovePDF alternatives — Private PDF tools | PleaseFixMyPDF",
    description: "PleaseFixMyPDF: an iLovePDF alternative that processes PDFs in your browser.",
    url: "https://pleasefixmypdf.com/alternatives/ilovepdf-alternatives/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Alternatives", url: "/alternatives" },
  { name: "iLovePDF alternatives", url: "/alternatives/ilovepdf-alternatives" },
];

export default function IlovepdfAlternativesPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap mx-auto max-w-3xl space-y-10 px-4 pb-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            iLovePDF alternatives
          </h1>
          <p className="text-gray-600 dark:text-slate-300">
            If you want PDF tools that don’t upload your files to a server, PleaseFixMyPDF is a
            strong alternative. Everything runs in your browser.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Why look for an alternative?</h2>
          <p className="text-gray-700 dark:text-gray-300">
            iLovePDF is popular but processes your PDFs on their servers. That’s fine for many users,
            but if you handle sensitive, legal, or work documents, you may prefer a tool that never
            sends your file anywhere.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">PleaseFixMyPDF as an iLovePDF alternative</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We offer merge, split, rotate, reorder, compress, Word to PDF, PDF to Word, image to
            PDF, and PDF to JPG — all in your browser. No upload, no signup required to start. Your
            files never leave your device.
          </p>
          <Link href="/tools" className="primary-button inline-block">
            Try all tools
          </Link>
        </section>
      </div>
    </>
  );
}
