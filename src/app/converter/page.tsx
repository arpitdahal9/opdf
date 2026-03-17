import type { Metadata } from "next";
import { FileText, Image as ImageIcon, Minimize2 } from "lucide-react";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { ToolCard } from "@/components/shared/ToolCard";

export const metadata: Metadata = {
  title: "PDF Converter Hub — Word, Images, and Compression | PleaseFixMyPDF.com",
  description:
    "Word to PDF, PDF to Word, image to PDF, and compress PDF—all in one hub. Everything runs in your browser.",
  alternates: { canonical: "/converter" },
  openGraph: {
    title: "PDF Converter Hub — Word, Images, and Compression | PleaseFixMyPDF.com",
    description:
      "Word to PDF, PDF to Word, image to PDF, and compress PDF—all in one hub. Everything runs in your browser.",
    url: "/converter",
  },
};

const converterTools = [
  {
    href: "/word-to-pdf",
    title: "Word to PDF",
    description: "Convert DOCX to PDF in your browser. No uploads.",
    icon: FileText,
    accent: "blue" as const,
  },
  {
    href: "/pdf-to-word",
    title: "PDF to Word",
    description: "Extract PDF text into an editable Word document.",
    icon: FileText,
    accent: "red" as const,
  },
  {
    href: "/pdf-to-jpg",
    title: "PDF to JPG",
    description: "Convert each PDF page to a JPG image. No upload.",
    icon: ImageIcon,
    accent: "red" as const,
  },
  {
    href: "/image-to-pdf",
    title: "Image to PDF",
    description: "Turn JPG, PNG, GIF, or WebP images into a single ordered PDF.",
    icon: ImageIcon,
    accent: "blue" as const,
  },
  {
    href: "/compress",
    title: "Compress PDF",
    description: "Reduce PDF size for faster sharing while keeping it readable.",
    icon: Minimize2,
    accent: "red" as const,
  },
  {
    href: "/pdf-to-text",
    title: "PDF to Text",
    description: "Extract text from PDF or turn text into a simple PDF.",
    icon: FileText,
    accent: "blue" as const,
  },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Converter", url: "/converter" },
];

export default function ConverterHubPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap animate-fadeIn space-y-10">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PDF Converter Hub</h1>
        <p className="max-w-2xl text-ink-muted dark:text-slate-300">
          All your conversion tools in one place. Move between Word, images, and PDF compression
          without leaving your browser.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {converterTools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </section>
    </div>
    </>
  );
}

