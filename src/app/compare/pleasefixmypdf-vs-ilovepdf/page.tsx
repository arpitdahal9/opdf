import type { Metadata } from "next";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { CompareCta, ComparisonTable } from "@/components/compare/ComparisonTable";

export const metadata: Metadata = {
  title: "PleaseFixMyPDF vs iLovePDF — Privacy and pricing compared | PleaseFixMyPDF",
  description:
    "Compare PleaseFixMyPDF and iLovePDF: client-side vs server-side, pricing, file limits. Your files never leave your device with us.",
  alternates: { canonical: "https://pleasefixmypdf.com/compare/pleasefixmypdf-vs-ilovepdf/" },
  openGraph: {
    title: "PleaseFixMyPDF vs iLovePDF — Privacy and pricing compared",
    description: "Compare PleaseFixMyPDF and iLovePDF: client-side vs server-side, pricing, file limits.",
    url: "https://pleasefixmypdf.com/compare/pleasefixmypdf-vs-ilovepdf/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Compare", url: "/compare" },
  { name: "PleaseFixMyPDF vs iLovePDF", url: "/compare/pleasefixmypdf-vs-ilovepdf" },
];

const featureRows = [
  { feature: "Processing", pleasefix: "In your browser (client-side)", competitor: "On their servers" },
  { feature: "Privacy", pleasefix: true, competitor: "Files uploaded to servers" },
  { feature: "Daily free limit", pleasefix: "5 operations", competitor: "Daily caps + 15MB" },
  { feature: "Cheapest paid", pleasefix: "$49.95 lifetime or $4/mo", competitor: "$48/year" },
];

export default function CompareIlovepdfPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap mx-auto max-w-3xl space-y-10 px-4 pb-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            PleaseFixMyPDF vs iLovePDF
          </h1>
          <p className="text-gray-600 dark:text-slate-300">
            Both offer PDF tools; the main difference is where your files go. We process everything in
            your browser — iLovePDF uploads files to their servers.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy & processing</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Your files never leave your device with PleaseFixMyPDF. Every competitor, including
            iLovePDF, uploads your PDFs to their servers. If you handle sensitive or work documents,
            client-side processing is a real advantage.
          </p>
          <ComparisonTable
            title="Feature"
            rows={featureRows}
            competitorName="iLovePDF"
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pricing</h2>
          <p className="text-gray-700 dark:text-gray-300">
            iLovePDF charges $48/year for Premium. We offer $4/month or a $49.95 one-time lifetime
            deal — no recurring fee after that.
          </p>
        </section>

        <CompareCta />
      </div>
    </>
  );
}
