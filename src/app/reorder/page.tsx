import type { Metadata } from "next";

import { ReorderWorkspace } from "@/components/reorder/ReorderWorkspace";

export const metadata: Metadata = {
  title: "Reorder PDF Pages Online ? Free, Private, No Upload",
  description:
    "Rearrange PDF pages with drag and drop in your browser, then download the new order instantly.",
  alternates: { canonical: "/reorder" },
  openGraph: {
    title: "Reorder PDF Pages Online ? Free, Private, No Upload | PDFKit",
    description:
      "Rearrange PDF pages with drag and drop in your browser, then download the new order instantly.",
    url: "/reorder",
  },
};

export default function ReorderPage() {
  return <ReorderWorkspace />;
}
