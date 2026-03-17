import type { Metadata } from "next";
import Link from "next/link";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "PDF tools for legal professionals — Private, no upload | PleaseFixMyPDF",
  description:
    "Merge, sign, and protect legal PDFs. Client-side processing — your documents never leave your device.",
  alternates: { canonical: "https://pleasefixmypdf.com/for/legal/" },
  openGraph: {
    title: "PDF tools for legal | PleaseFixMyPDF",
    description: "Private PDF tools for legal: merge, compress. No server upload.",
    url: "https://pleasefixmypdf.com/for/legal/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "For legal", url: "/for/legal" },
];

const tools = [
  { href: "/merge", label: "Merge PDF", desc: "Combine case documents and exhibits" },
  { href: "/compress", label: "Compress PDF", desc: "Reduce size for email and filings" },
  { href: "/reorder", label: "Reorder PDF", desc: "Rearrange pages in the right order" },
];

export default function ForLegalPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap mx-auto max-w-3xl space-y-10 px-4 pb-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            PDF tools for legal professionals
          </h1>
          <p className="text-gray-600 dark:text-slate-300">
            Merge, reorder, and compress legal documents in your browser. No upload to third-party
            servers — your files stay on your device.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Relevant tools</h2>
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy and compliance</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            PleaseFixMyPDF processes every file in your browser. Nothing is sent to our servers — no
            data breach risk from our side, no need to rely on a vendor for your documents. That is
            a real advantage when handling confidential or privileged material.
          </p>
          <Link href="/tools" className="primary-button mt-4 inline-block">
            View all tools
          </Link>
        </section>
      </div>
    </>
  );
}
