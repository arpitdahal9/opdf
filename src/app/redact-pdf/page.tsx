import type { Metadata } from "next";

import { RedactPdfWorkspace } from "@/components/redact/RedactPdfWorkspace";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "Redact PDF Online — Permanently Black Out Sensitive Data",
  description:
    "Redact sensitive text and areas in your PDF directly in your browser. Draw redaction boxes, apply permanent blackouts, and download instantly.",
  alternates: { canonical: "https://pleasefixmypdf.com/redact-pdf/" },
  openGraph: {
    title: "Redact PDF Online — Permanently Black Out Sensitive Data",
    description:
      "Redact sensitive text and areas in your PDF directly in your browser. Draw redaction boxes, apply permanent blackouts, and download instantly.",
    url: "https://pleasefixmypdf.com/redact-pdf/",
  },
};

const relatedTools = [
  { href: "/sign-pdf", label: "Sign PDF" },
  { href: "/compress", label: "Compress PDF" },
  { href: "/merge", label: "Merge PDF" },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Redact PDF", url: "/redact-pdf" },
];

export default function RedactPdfPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <RedactPdfWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}

