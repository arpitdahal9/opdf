import type { Metadata } from "next";

import { MergeWorkspace } from "@/components/merge/MergeWorkspace";

export const metadata: Metadata = {
  title: "Merge PDF Files Online ? Free, Private, No Upload",
  description:
    "Combine multiple PDF files into one document instantly. 100% browser-based, and your files never leave your device.",
  alternates: { canonical: "/merge" },
  openGraph: {
    title: "Merge PDF Files Online ? Free, Private, No Upload | PDFKit",
    description:
      "Combine multiple PDF files into one document instantly. 100% browser-based, and your files never leave your device.",
    url: "/merge",
  },
};

export default function MergePage() {
  return <MergeWorkspace />;
}
