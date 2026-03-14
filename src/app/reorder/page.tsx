import type { Metadata } from "next";

import { ReorderWorkspace } from "@/components/reorder/ReorderWorkspace";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "Reorder PDF Pages Free Online — Rearrange PDF",
  description:
    "Drag and drop to rearrange PDF pages in any order. Free, private, no upload. Reorder and download instantly.",
  alternates: { canonical: "https://pleasefixmypdf.com/reorder/" },
  openGraph: {
    title: "Reorder PDF Pages Free Online — Rearrange PDF",
    description:
      "Drag and drop to rearrange PDF pages in any order. Free, private, no upload. Reorder and download instantly.",
    url: "https://pleasefixmypdf.com/reorder/",
  },
};

const relatedTools = [
  { href: "/merge", label: "Merge PDF" },
  { href: "/split", label: "Split PDF" },
  { href: "/rotate", label: "Rotate PDF" },
];

export default function ReorderPage() {
  return (
    <>
      <ReorderWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}
