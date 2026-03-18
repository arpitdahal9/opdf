import {
  ArrowUpDown,
  FileText,
  Gauge,
  Image as ImageIcon,
  Lock,
  Minimize2,
  PenLine,
  RotateCw,
  Scissors,
  Workflow,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const LOGO_URL = "/logo.png";

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
  {
    href: "/pdf-to-jpg",
    title: "PDF to JPG",
    description: "Turn each PDF page into a JPG image you can download.",
    icon: ImageIcon,
    accent: "blue" as const,
  },
  {
    href: "/pdf-to-png",
    title: "PDF to PNG",
    description: "Convert PDF pages to crisp PNG images with transparency.",
    icon: ImageIcon,
    accent: "red" as const,
  },
  {
    href: "/jpg-to-pdf",
    title: "JPG to PDF",
    description: "Turn one or many JPG images into a single PDF.",
    icon: ImageIcon,
    accent: "blue" as const,
  },
  {
    href: "/png-to-pdf",
    title: "PNG to PDF",
    description: "Convert PNG images into an ordered PDF in your browser.",
    icon: ImageIcon,
    accent: "red" as const,
  },
  {
    href: "/pdf-to-text",
    title: "PDF to Text",
    description: "Extract text from PDFs or turn text into a simple PDF.",
    icon: FileText,
    accent: "blue" as const,
  },
  {
    href: "/sign-pdf",
    title: "Sign PDF",
    description: "Draw a signature and stamp it onto every page of a PDF.",
    icon: PenLine,
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
      {/* Hero */}
      <section className="space-y-10 py-8 sm:py-12">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
          <div className="space-y-4 sm:flex-1">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              Every PDF tool you need. Private by design.
            </h1>
            <p className="max-w-xl text-sm text-gray-600 dark:text-gray-400">
              Merge, split, rotate, compress, convert, and sign — all in your browser. Your PDFs stay on this device,
              not on our servers.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <Link href="/merge" className="primary-button">
                Start with Merge PDF
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300"
              >
                View all 14 tools
              </Link>
            </div>
          </div>
          <div className="w-full max-w-md space-y-4 rounded-xl border border-border bg-white p-4 shadow-md dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Quick access
            </p>
            <div className="grid grid-cols-2 gap-3 text-left">
              {[
                tools.find((t) => t.href === "/merge"),
                tools.find((t) => t.href === "/split"),
                tools.find((t) => t.href === "/rotate"),
                tools.find((t) => t.href === "/compress"),
                tools.find((t) => t.href === "/word-to-pdf"),
                tools.find((t) => t.href === "/pdf-to-word"),
                tools.find((t) => t.href === "/image-to-pdf"),
                tools.find((t) => t.href === "/sign-pdf"),
              ]
                .filter(Boolean)
                .map((tool) => {
                  const Icon = tool!.icon;
                  return (
                    <Link
                      key={tool!.href}
                      href={tool!.href}
                      className="group flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-900 dark:text-gray-100"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/5 text-primary">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span>{tool!.title}</span>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="mt-4 grid gap-3 rounded-xl border border-border bg-white/80 px-4 py-3 text-xs text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-300 sm:grid-cols-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <span role="img" aria-hidden>
              🔒
            </span>
            <div>
              <p className="font-semibold">100% browser-based</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Files never leave your device.</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 border-t border-border pt-3 sm:justify-start sm:border-l sm:border-t-0 sm:pl-4">
            <span role="img" aria-hidden>
              ⚡
            </span>
            <div>
              <p className="font-semibold">Lightning fast</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">No upload or download wait times.</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 border-t border-border pt-3 sm:justify-start sm:border-l sm:border-t-0 sm:pl-4">
            <span role="img" aria-hidden>
              🛡️
            </span>
            <div>
              <p className="font-semibold">Built for daily work</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Designed for teams handling PDFs all day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="card-surface space-y-4 p-6 sm:p-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Trusted by education and admin teams
        </h2>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              &ldquo;We process dozens of student PDFs every day. PleaseFixMyPDF is the only tool that stays fast and
              doesn&apos;t send files anywhere.&rdquo;
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Education counsellor, Cloud Education</p>
          </div>
          <div className="rounded-lg border border-border bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-300">
            <p>
              Also used by migration agents and admin teams across Australia who need reliable, browser‑based PDF
              tools.
            </p>
          </div>
        </div>
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

      {/* All in one + Privacy + Benefits */}
      <section className="card-surface mx-auto max-w-6xl space-y-8 p-6 sm:p-8" aria-label="All in one tool and benefits">
        {/* All in one tool */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="shrink-0">
            <Image
              src={LOGO_URL}
              alt="PleaseFixMyPDF"
              width={280}
              height={280}
              className="h-48 w-48 object-contain sm:h-64 sm:w-64 md:h-72 md:w-72"
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

        {/* Privacy CTA */}
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/30 p-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between sm:p-5">
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
        </div>

        {/* Feature strip */}
        <div className="grid gap-4 md:grid-cols-3">
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex flex-col gap-2 rounded-lg border border-border bg-muted/20 px-5 py-5 dark:border-gray-700"
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
        </div>
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
