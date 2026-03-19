import type { Metadata } from "next";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { ReorderWorkspace } from "@/components/reorder/ReorderWorkspace";

export const metadata: Metadata = {
  title: "Organize PDF Online — Reorder Pages | PleaseFixMyPDF",
  description:
    "Organize your PDF by dragging pages into a new order. Private, no upload. Download instantly.",
  alternates: { canonical: "https://pleasefixmypdf.com/organize-pdf/" },
  openGraph: {
    title: "Organize PDF Online — Reorder Pages | PleaseFixMyPDF",
    description:
      "Organize your PDF by dragging pages into a new order. Private, no upload. Download instantly.",
    url: "https://pleasefixmypdf.com/organize-pdf/",
  },
};

const relatedTools = [
  { href: "/merge", label: "Merge PDF" },
  { href: "/split", label: "Split PDF" },
  { href: "/rotate", label: "Rotate PDF" },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Organize PDF", url: "/organize-pdf" },
];

export default function OrganizePdfPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ReorderWorkspace
        title="Organize PDF"
        description="Drag pages into a new sequence, reset if needed, and download an organized PDF when you are happy."
      />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}

