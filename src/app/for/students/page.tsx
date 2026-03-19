import type { Metadata } from "next";
import Link from "next/link";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "PDF tools for students — Merge, compress, convert | PleaseFixMyPDF",
  description:
    "Free PDF tools for students: merge assignments, compress for email limits, convert Word to PDF. No upload, private.",
  alternates: { canonical: "https://pleasefixmypdf.com/for/students/" },
  openGraph: {
    title: "PDF tools for students | PleaseFixMyPDF",
    description: "Merge, compress, and convert PDFs for school. No upload, private.",
    url: "https://pleasefixmypdf.com/for/students/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "For students", url: "/for/students" },
];

const tools = [
  { href: "/merge", label: "Merge PDF", desc: "Combine assignments into one file" },
  { href: "/compress", label: "Compress PDF", desc: "Shrink files for email submission limits" },
  { href: "/word-to-pdf", label: "Word to PDF", desc: "Convert essays and docs for submission" },
];

export default function ForStudentsPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap mx-auto max-w-3xl space-y-10 px-4 pb-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PDF tools for students</h1>
          <p className="text-gray-600 dark:text-slate-300">
            Merge assignment PDFs, compress for submission limits, and convert Word to PDF — all in
            your browser. No upload.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tools you’ll use</h2>
          <ul className="space-y-3">
            {tools.map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="block rounded-lg border border-border bg-white p-4 hover:shadow-md dark:bg-gray-900 dark:border-gray-700"
                >
                  <span className="font-medium text-primary">{t.label}</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">— {t.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-gray-50 p-6 dark:bg-gray-800/50 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Why use PleaseFixMyPDF?</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Your files never leave your device. We don’t upload your assignments or essays to any
            server — everything runs in your browser. That means better privacy and no worry about
            who can see your work.
          </p>
          <Link href="/tools" className="primary-button mt-4 inline-block">
            View all tools
          </Link>
        </section>
      </div>
    </>
  );
}
