import {
  ArrowUpDown,
  FileText,
  Gauge,
  Image as ImageIcon,
  Lock,
  Minimize2,
  RotateCw,
  Scissors,
  Workflow,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const LOGO_URL = "https://files.catbox.moe/8buz43.png";

import { ToolCard } from "@/components/shared/ToolCard";

const tools = [
  {
    href: "/merge",
    title: "Merge PDF",
    description: "Combine multiple PDFs into one clean document in the exact order you want.",
    icon: Workflow,
    accent: "blue" as const,
  },
  {
    href: "/split",
    title: "Split PDF",
    description: "Extract the exact pages you need with page picking or flexible ranges.",
    icon: Scissors,
    accent: "red" as const,
  },
  {
    href: "/rotate",
    title: "Rotate PDF",
    description: "Rotate one page or every page with instant visual previews before download.",
    icon: RotateCw,
    accent: "blue" as const,
  },
  {
    href: "/reorder",
    title: "Reorder PDF",
    description: "Drag pages into a new sequence and save a reorganized PDF in seconds.",
    icon: ArrowUpDown,
    accent: "red" as const,
  },
  {
    href: "/word-to-pdf",
    title: "Word to PDF",
    description: "Convert Word documents (DOCX) to PDF in your browser. No uploads.",
    icon: FileText,
    accent: "blue" as const,
  },
  {
    href: "/pdf-to-word",
    title: "PDF to Word",
    description: "Extract PDF text into an editable Word document. 100% in-browser.",
    icon: FileText,
    accent: "red" as const,
  },
  {
    href: "/image-to-pdf",
    title: "Image to PDF",
    description: "Combine JPG, PNG, GIF, or WebP images into a single ordered PDF.",
    icon: ImageIcon,
    accent: "blue" as const,
  },
  {
    href: "/compress",
    title: "Compress PDF",
    description: "Shrink PDF file size while keeping quality readable and shareable.",
    icon: Minimize2,
    accent: "red" as const,
  },
];

const featureCards = [
  {
    icon: Zap,
    title: "Lightning fast",
    description: "Process your PDFs in seconds with an optimized, all‑client workflow.",
  },
  {
    icon: Lock,
    title: "Private by default",
    description: "Every file stays in your browser. Nothing is ever uploaded or stored.",
  },
  {
    icon: Gauge,
    title: "Built for heavy work",
    description: "Comfortably handle large files and complex edits without feeling slow.",
  },
];

export default function HomePage() {
  return (
    <div className="page-wrap animate-fadeIn space-y-14">
      {/* Hero - iLovePDF style: centered, simple */}
      <section className="flex flex-col items-center px-4 py-12 text-center sm:py-16">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          Merge PDF files
        </h1>
        <p className="mt-3 max-w-xl text-base text-gray-600 dark:text-gray-400">
          Combine PDFs in the order you want with the easiest PDF merger available.
        </p>
        <div className="mt-8 flex items-center gap-2">
          <Link href="/merge" className="primary-button">
            Select PDF files
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">or drop PDFs here</p>
      </section>

      {/* Tools grid */}
      <section id="tools" className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All PDF tools</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Merge, split, rotate, reorder, convert, compress, and more. All in your browser.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </section>

      {/* All in One Tools checklist & feature list (below tools) */}
      <section className="card-surface mx-auto max-w-4xl space-y-6 p-6" aria-label="All in one tool">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="shrink-0">
            <Image
              src={LOGO_URL}
              alt="PleaseFixMyPDF"
              width={280}
              height={280}
              className="h-48 w-48 object-contain sm:h-64 sm:w-64 md:h-72 md:w-72"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">All in one tool</h2>
            <ul className="flex flex-col gap-2 text-gray-700 dark:text-gray-300" aria-label="Feature checklist">
              <li className="flex items-center gap-2">
                <span className="text-primary font-medium" aria-hidden>✓</span>
                <span>Merge, reorder, and split—all in one feature set.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary font-medium" aria-hidden>✓</span>
                <span>You can reorder when merging as well.</span>
              </li>
            </ul>
            <div className="border-t border-border pt-4 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Tools with multiple functions</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                <li><strong className="text-gray-900 dark:text-white">Merge PDF:</strong> Combine files, reorder pages across files, and rotate pages—all before downloading.</li>
                <li><strong className="text-gray-900 dark:text-white">Split PDF:</strong> Extract by selecting specific pages or by entering page ranges (e.g. 1–5, 8).</li>
                <li><strong className="text-gray-900 dark:text-white">Rotate PDF:</strong> Rotate individual pages or the entire document in one go.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy CTA */}
      <section className="card-surface mx-auto flex max-w-4xl flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Private by design
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Every PDF is processed in your browser. Nothing is uploaded or stored.
            </p>
          </div>
        </div>
        <Link href="/merge" className="primary-button shrink-0">
          Get started
        </Link>
      </section>

      {/* Feature strip at bottom */}
      <section className="grid gap-4 md:grid-cols-3">
        {featureCards.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="card-surface flex flex-col gap-2 px-5 py-5"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 80}ms both`,
              }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          );
        })}
      </section>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
