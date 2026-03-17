import type { Metadata } from "next";
import {
  FileText,
  FileSearch,
  Hash,
  Image as ImageIcon,
  Merge,
  Minimize2,
  Move,
  RotateCw,
  Scissors,
  type LucideIcon,
} from "lucide-react";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { ToolCard } from "@/components/shared/ToolCard";
import { allConversions, allTools } from "@/lib/content";

export const metadata: Metadata = {
  title: "All PDF Tools — Merge, Split, Convert, Compress | PleaseFixMyPDF.com",
  description:
    "Every PDF tool in one place: merge, split, rotate, reorder, compress, Word to PDF, PDF to Word, image to PDF. All run in your browser.",
  alternates: { canonical: "https://pleasefixmypdf.com/tools/" },
  openGraph: {
    title: "All PDF Tools — Merge, Split, Convert, Compress | PleaseFixMyPDF.com",
    description:
      "Every PDF tool in one place: merge, split, rotate, reorder, compress, Word to PDF, PDF to Word, image to PDF. All run in your browser.",
    url: "https://pleasefixmypdf.com/tools/",
  },
};

const toolIcons: Record<string, LucideIcon> = {
  merge: Merge,
  split: Scissors,
  rotate: RotateCw,
  reorder: Move,
  compress: Minimize2,
};

const conversionIcons: Record<string, LucideIcon> = {
  "word-to-pdf": FileText,
  "pdf-to-word": FileText,
  "image-to-pdf": ImageIcon,
  "pdf-to-jpg": ImageIcon,
  "pdf-to-png": ImageIcon,
  "jpg-to-pdf": ImageIcon,
  "png-to-pdf": ImageIcon,
  "pdf-to-text": FileText,
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
];

export default function ToolsHubPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap animate-fadeIn space-y-12">
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All PDF tools</h1>
          <p className="max-w-2xl text-ink-muted dark:text-slate-300">
            Merge, split, rotate, reorder, compress, and convert — everything runs in your browser.
            No uploads, no signup.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit & organise</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {allTools.map((tool) => {
              const Icon = toolIcons[tool.slug] ?? Merge;
              return (
                <ToolCard
                  key={tool.slug}
                  href={tool.path}
                  title={tool.name}
                  description={tool.description}
                  icon={Icon}
                  accent="blue"
                />
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Convert</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {allConversions.map((conv) => {
              const Icon = conversionIcons[conv.slug] ?? FileText;
              return (
                <ToolCard
                  key={conv.slug}
                  href={conv.path}
                  title={conv.name}
                  description={conv.description}
                  icon={Icon}
                  accent="red"
                />
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Utilities</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ToolCard
              href="/tools/pdf-page-counter"
              title="PDF page counter"
              description="Count pages in any PDF. No upload."
              icon={Hash}
              accent="blue"
            />
            <ToolCard
              href="/tools/pdf-metadata-viewer"
              title="PDF metadata viewer"
              description="View PDF properties: title, author, dates."
              icon={FileSearch}
              accent="blue"
            />
            <ToolCard
              href="/tools/pdf-file-size-checker"
              title="PDF file size checker"
              description="Check PDF file size. No upload."
              icon={Minimize2}
              accent="blue"
            />
          </div>
        </section>
      </div>
    </>
  );
}
