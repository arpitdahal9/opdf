import type { Metadata } from "next";

import { RotateWorkspace } from "@/components/rotate/RotateWorkspace";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "Rotate PDF Free Online — Rotate PDF Pages Instantly",
  description:
    "Rotate PDF pages 90°, 180°, or 270°. Rotate one page or all pages. Free, no upload, works in your browser.",
  alternates: { canonical: "https://pleasefixmypdf.com/rotate/" },
  openGraph: {
    title: "Rotate PDF Free Online — Rotate PDF Pages Instantly",
    description:
      "Rotate PDF pages 90°, 180°, or 270°. Rotate one page or all pages. Free, no upload, works in your browser.",
    url: "https://pleasefixmypdf.com/rotate/",
  },
};

const relatedTools = [
  { href: "/reorder", label: "Reorder PDF" },
  { href: "/split", label: "Split PDF" },
  { href: "/merge", label: "Merge PDF" },
];

export default function RotatePage() {
  return (
    <>
      <RotateWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}
