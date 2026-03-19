import type { Metadata } from "next";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { QrCodeGeneratorTool } from "@/components/tools/QrCodeGeneratorTool";

export const metadata: Metadata = {
  title: "QR code generator — Create QR codes online | PleaseFixMyPDF",
  description:
    "Generate a QR code from any text or URL in your browser. Private, fast, and free to use.",
  alternates: { canonical: "https://pleasefixmypdf.com/tools/qr-code-generator/" },
  openGraph: {
    title: "QR code generator — Create QR codes online | PleaseFixMyPDF",
    description:
      "Generate a QR code from any text or URL in your browser. Private, fast, and free to use.",
    url: "https://pleasefixmypdf.com/tools/qr-code-generator/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
  { name: "QR code generator", url: "/tools/qr-code-generator" },
];

export default function QrCodeGeneratorPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap animate-fadeIn space-y-8">
        <section className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">QR code generator</h1>
          <p className="max-w-2xl text-ink-muted dark:text-slate-300">
            Create a QR code from any text or URL — runs in your browser.
          </p>
        </section>
        <QrCodeGeneratorTool />
      </div>
    </>
  );
}

