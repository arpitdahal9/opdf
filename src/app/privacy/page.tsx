import type { Metadata } from "next";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Privacy Policy | PleaseFixMyPDF",
  description:
    "Privacy policy for PleaseFixMyPDF. Learn how we handle your data, browser-based processing, and third‑party services.",
  alternates: { canonical: "https://pleasefixmypdf.com/privacy/" },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Privacy policy", url: "/privacy" },
];

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy policy</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {new Date().getFullYear()}
          </p>
        </header>

        <section className="card-surface space-y-4 p-6 sm:p-8">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            PleaseFixMyPDF is designed to keep your documents as private as possible. Most of the tools on this site
            run entirely in your browser, so your PDFs never leave your device or get uploaded to our servers.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">1. Files and documents</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
            <li>PDFs and other documents you open in the tools are processed locally in your browser.</li>
            <li>
              We do not upload your PDFs to our own servers for the core editing and conversion tools (merge, split,
              rotate, reorder, compress, image to PDF, PDF to image, PDF to text, sign PDF, etc.).
            </li>
            <li>
              Once you close the page or tab, the in‑browser data used for processing is discarded by your browser.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">2. Accounts and payments</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            If you choose to purchase a paid plan, payments are processed securely by our payment provider
            (LemonSqueezy). We do not store your full card details on our own servers.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
            <li>
              Basic billing information (such as your name, email address, and transaction details) may be stored by
              LemonSqueezy in order to provide receipts, handle refunds, and meet legal obligations.
            </li>
            <li>
              We may keep a record of your plan and usage limits so we can provide the service you have paid for.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">3. Cookies and analytics</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            We aim to keep tracking to a minimum. If we use analytics, it is only to understand aggregate usage (for
            example, which tools are most popular) so we can improve the product.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
            <li>
              We do not sell your personal data to third parties or use it for targeted advertising across other
              websites.
            </li>
            <li>
              Any analytics tools we use are configured, where possible, to avoid collecting personally identifiable
              information.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">4. Contact</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            If you have any questions about this privacy policy or how your data is handled, please reach out to us via
            the contact details on the site or reply to any email you received from PleaseFixMyPDF.
          </p>
        </section>
      </div>
    </>
  );
}

