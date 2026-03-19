import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

import { CheckoutButton } from "@/components/pricing/CheckoutButton";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Pricing — Pro & Lifetime | PleaseFixMyPDF.com",
  description:
    "Pro $4/month or $49.95 lifetime. Unlimited operations, batch processing, OCR. No subscription lock-in.",
  alternates: { canonical: "https://pleasefixmypdf.com/pricing/" },
  openGraph: {
    title: "Pricing — Pro & Lifetime | PleaseFixMyPDF.com",
    description:
      "Pro $4/month or $49.95 lifetime. Unlimited operations, batch processing, OCR. No subscription lock-in.",
    url: "https://pleasefixmypdf.com/pricing/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Pricing", url: "/pricing" },
];

const freeFeatures = [
  "5 operations per day",
  "Merge, split, rotate, reorder, compress",
  "Word to PDF, PDF to Word, image to PDF",
  "10MB max file size",
  "No uploads (browser-based)",
];

const proFeatures = [
  "Unlimited operations",
  "Batch processing",
  "OCR (text from scanned PDFs)",
  "100MB max file size",
  "Advanced e-signatures",
  "Priority processing",
];

export default function PricingPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap animate-fadeIn">
        <div className="mx-auto max-w-4xl space-y-12">
          <section className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pricing</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Start free. Upgrade when you need more. SmallPDF costs $120/year. iLovePDF costs
              $48/year. We offer $4/month or $49.95 once, forever.
            </p>
          </section>

          <section id="lifetime" className="grid gap-6 sm:grid-cols-2">
            {/* Pro monthly */}
            <div className="rounded-2xl border border-border bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pro monthly</h2>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                $4<span className="text-base font-normal text-gray-500">/month</span>
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Billed monthly. Cancel anytime.
              </p>
              <ul className="mt-6 space-y-3">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <CheckoutButton
                plan="monthly"
                className="mt-6 block w-full text-center primary-button"
              >
                Get Pro
              </CheckoutButton>
            </div>

            {/* Lifetime — highlighted */}
            <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6 dark:bg-primary/10 relative">
              <span className="absolute -top-3 left-4 bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded">
                Best value
              </span>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Lifetime</h2>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">$49.95</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                One-time. No recurring fees. About $4.16/month for the first year, then $0 forever.
              </p>
              <ul className="mt-6 space-y-3">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <CheckoutButton
                plan="lifetime"
                className="mt-6 block w-full text-center primary-button"
              >
                Get lifetime
              </CheckoutButton>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-gray-50 dark:bg-gray-800/50 p-6 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Free tier</h2>
            <ul className="mt-3 space-y-2">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="h-5 w-5 shrink-0 text-gray-500" />
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <section className="text-center">
            <Link href="/tools" className="text-primary font-medium hover:underline">
              View all tools →
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
