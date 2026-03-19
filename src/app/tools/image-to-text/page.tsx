import type { Metadata } from "next";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { ImageToTextTool } from "@/components/tools/ImageToTextTool";

export const metadata: Metadata = {
  title: "Image to Text — OCR image online | PleaseFixMyPDF",
  description:
    "Extract text from images (OCR) in your browser. Private, no upload required. Supports PNG, JPG, WebP, GIF.",
  alternates: { canonical: "https://pleasefixmypdf.com/tools/image-to-text/" },
  openGraph: {
    title: "Image to Text — OCR image online | PleaseFixMyPDF",
    description:
      "Extract text from images (OCR) in your browser. Private, no upload required. Supports PNG, JPG, WebP, GIF.",
    url: "https://pleasefixmypdf.com/tools/image-to-text/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
  { name: "Image to Text", url: "/tools/image-to-text" },
];

export default function ImageToTextPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap animate-fadeIn space-y-8">
        <section className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Image to Text</h1>
          <p className="max-w-2xl text-ink-muted dark:text-slate-300">
            Extract text from an image using OCR — 100% in your browser.
          </p>
        </section>
        <ImageToTextTool />
      </div>
    </>
  );
}

