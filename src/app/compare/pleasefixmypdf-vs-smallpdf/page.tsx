import type { Metadata } from "next";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { CompareCta, ComparisonTable } from "@/components/compare/ComparisonTable";

export const metadata: Metadata = {
  title: "PleaseFixMyPDF vs SmallPDF — Compare PDF tools | PleaseFixMyPDF",
  description:
    "PleaseFixMyPDF vs SmallPDF: we process in your browser; they upload to servers. Compare pricing and privacy.",
  alternates: { canonical: "https://pleasefixmypdf.com/compare/pleasefixmypdf-vs-smallpdf/" },
  openGraph: {
    title: "PleaseFixMyPDF vs SmallPDF — Compare PDF tools",
    description: "PleaseFixMyPDF vs SmallPDF: we process in your browser; they upload to servers.",
    url: "https://pleasefixmypdf.com/compare/pleasefixmypdf-vs-smallpdf/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Compare", url: "/compare" },
  { name: "PleaseFixMyPDF vs SmallPDF", url: "/compare/pleasefixmypdf-vs-smallpdf" },
];

const featureRows = [
  { feature: "Processing", pleasefix: "In your browser (client-side)", competitor: "On their servers" },
  { feature: "Privacy", pleasefix: true, competitor: "Files uploaded to servers" },
  { feature: "Free tier", pleasefix: "5 operations/day", competitor: "2 tasks/day" },
  { feature: "Cheapest paid", pleasefix: "$49.95 lifetime or $4/mo", competitor: "$10/mo (~$120/year)" },
];

export default function CompareSmallpdfPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap mx-auto max-w-3xl space-y-10 px-4 pb-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            PleaseFixMyPDF vs SmallPDF
          </h1>
          <p className="text-gray-600 dark:text-slate-300">
            SmallPDF is popular but restricts free users to 2 tasks per day and processes files on
            their servers. We run everything in your browser — no upload, no daily cap like that.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy & processing</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Your files never leave your device with PleaseFixMyPDF. SmallPDF uploads your PDFs to
            their servers. For confidential documents, client-side processing is the safer choice.
          </p>
          <ComparisonTable
            title="Feature"
            rows={featureRows}
            competitorName="SmallPDF"
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pricing</h2>
          <p className="text-gray-700 dark:text-gray-300">
            SmallPDF Pro is about $120/year. We offer $4/month or $49.95 once for lifetime access —
            no recurring fee.
          </p>
        </section>

        <CompareCta />
      </div>
    </>
  );
}
