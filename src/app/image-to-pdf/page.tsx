import type { Metadata } from "next";

import { ImageToPdfWorkspace } from "@/components/image-to-pdf/ImageToPdfWorkspace";

export const metadata: Metadata = {
  title: "Convert Images to PDF Online — JPG, PNG to PDF | PleaseFixMyPDF.com",
  description:
    "Turn multiple images into a single PDF in your browser. Reorder pages, pick page size, and download instantly.",
  alternates: { canonical: "/image-to-pdf" },
  openGraph: {
    title: "Convert Images to PDF Online — JPG, PNG to PDF | PleaseFixMyPDF.com",
    description:
      "Turn multiple images into a single PDF in your browser. Reorder pages, pick page size, and download instantly.",
    url: "/image-to-pdf",
  },
};

export default function ImageToPdfPage() {
  return <ImageToPdfWorkspace />;
}

