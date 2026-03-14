import type { Metadata } from "next";

import { CompressWorkspace } from "@/components/compress/CompressWorkspace";

export const metadata: Metadata = {
  title: "Compress PDF Online — Reduce File Size Free | PleaseFixMyPDF.com",
  description:
    "Compress large PDFs without losing quality. Strip metadata and reduce file size instantly. 100% browser-based.",
  alternates: { canonical: "/compress" },
  openGraph: {
    title: "Compress PDF Online — Reduce File Size Free | PleaseFixMyPDF.com",
    description:
      "Compress large PDFs without losing quality. Strip metadata and reduce file size instantly. 100% browser-based.",
    url: "/compress",
  },
};

export default function CompressPage() {
  return <CompressWorkspace />;
}

