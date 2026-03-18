import type { Metadata } from "next";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Terms of Service | PleaseFixMyPDF",
  description:
    "Terms of Service for using PleaseFixMyPDF, including free tier limits, paid plans, and acceptable use.",
  alternates: { canonical: "https://pleasefixmypdf.com/terms/" },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Terms of service", url: "/terms" },
];

export default function TermsPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of service</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please read these terms carefully before using PleaseFixMyPDF.
          </p>
        </header>

        <section className="card-surface space-y-4 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">1. Using the service</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            PleaseFixMyPDF provides browser‑based tools for working with PDF files. By using the site, you agree to use
            it only for lawful purposes and in compliance with these terms.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">2. Free tier and paid plans</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
            <li>
              A free tier may be offered with limits on the number of operations per day, file sizes, or specific
              features.
            </li>
            <li>
              Paid plans (such as Pro or Lifetime) remove or relax some of these limits as described on the{" "}
              <a href="/pricing" className="text-primary underline">
                pricing
              </a>{" "}
              page.
            </li>
            <li>
              We may update limits or pricing from time to time. Any changes will apply to future purchases and, where
              relevant, will be communicated clearly.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">3. Payments and refunds</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
            <li>Payments are processed securely by our payment provider (LemonSqueezy) on our behalf.</li>
            <li>
              Because the product is delivered digitally, refunds are handled on a case‑by‑case basis. If something
              doesn&apos;t work as expected, contact us and we&apos;ll do our best to make it right.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">4. No guarantees</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            We aim to provide a reliable service, but we can&apos;t guarantee that PleaseFixMyPDF will be available at
            all times or free from errors. PDF processing can fail for some documents due to damaged files, unusual
            formats, or browser limitations.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            To the fullest extent permitted by law, PleaseFixMyPDF is provided &quot;as is&quot; without warranties of
            any kind, and we are not liable for any loss or damage arising from use of the service.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">5. Changes to these terms</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            We may update these terms from time to time. When we do, we&apos;ll update the date at the top of this
            page. Continued use of the service after changes means you accept the updated terms.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">6. Contact</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            If you have any questions about these terms, please reach out via the contact details on the site.
          </p>
        </section>
      </div>
    </>
  );
}

