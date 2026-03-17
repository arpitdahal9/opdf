import type { Metadata } from "next";
import Link from "next/link";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "PDF tools for healthcare — HIPAA-friendly, no upload | PleaseFixMyPDF",
  description:
    "Merge and compress healthcare PDFs in your browser. Your files never leave your device — no server upload.",
  alternates: { canonical: "https://pleasefixmypdf.com/for/healthcare/" },
  openGraph: {
    title: "PDF tools for healthcare | PleaseFixMyPDF",
    description: "Client-side PDF tools: no upload, your files stay on your device.",
    url: "https://pleasefixmypdf.com/for/healthcare/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "For healthcare", url: "/for/healthcare" },
];

const tools = [
  { href: "/merge", label: "Merge PDF", desc: "Combine records and forms" },
  { href: "/compress", label: "Compress PDF", desc: "Reduce file size for sharing" },
  { href: "/image-to-pdf", label: "Image to PDF", desc: "Turn scans or photos into PDFs" },
];

export default function ForHealthcarePage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap mx-auto max-w-3xl space-y-10 px-4 pb-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            PDF tools for healthcare
          </h1>
          <p className="text-gray-600 dark:text-slate-300">
            Merge, compress, and convert PDFs without uploading to any server. Everything runs in
            your browser — your files never leave your device.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tools we offer</h2>
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Why client-side matters</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            PleaseFixMyPDF does not upload your files to our servers. Processing happens entirely in
            your browser. That means no server-side data breach risk from our side and no need to
            send PHI to a third party. You remain in control of where your data goes.
          </p>
          <Link href="/tools" className="primary-button mt-4 inline-block">
            View all tools
          </Link>
        </section>
      </div>
    </>
  );
}
