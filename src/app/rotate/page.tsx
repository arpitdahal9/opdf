import type { Metadata } from "next";

import { RotateWorkspace } from "@/components/rotate/RotateWorkspace";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { RelatedTools } from "@/components/shared/RelatedTools";

export const metadata: Metadata = {
  title: "Rotate PDF Online — Rotate PDF Pages Instantly",
  description:
    "Rotate PDF pages 90°, 180°, or 270°. Rotate one page or all pages. No upload, works in your browser.",
  alternates: { canonical: "https://pleasefixmypdf.com/rotate/" },
  openGraph: {
    title: "Rotate PDF Online — Rotate PDF Pages Instantly",
    description:
      "Rotate PDF pages 90°, 180°, or 270°. Rotate one page or all pages. No upload, works in your browser.",
    url: "https://pleasefixmypdf.com/rotate/",
  },
};

const relatedTools = [
  { href: "/reorder", label: "Reorder PDF" },
  { href: "/split", label: "Split PDF" },
  { href: "/merge", label: "Merge PDF" },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Rotate PDF", url: "/rotate" },
];

export default function RotatePage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <RotateWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}
