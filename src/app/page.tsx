import {
  ArrowUpDown,
  Calculator,
  FileText,
  FileSearch,
  Gauge,
  Image as ImageIcon,
  Lock,
  Minimize2,
  PenLine,
  QrCode,
  RotateCw,
  ScanText,
  Shield,
  Shrink,
  Scissors,
  Workflow,
  Zap,
} from "lucide-react";
import Link from "next/link";

const tools = [
  {
    href: "/merge",
    title: "Merge PDF",
    description: "Combine files into one PDF in your preferred order.",
    icon: Workflow,
    accent: "blue" as const,
  },
  {
    href: "/split",
    title: "Split PDF",
    description: "Extract selected pages or split by ranges quickly.",
    icon: Scissors,
    accent: "red" as const,
  },
  {
    href: "/rotate",
    title: "Rotate PDF",
    description: "Rotate single pages or all pages in seconds.",
    icon: RotateCw,
    accent: "blue" as const,
  },
  {
    href: "/compress",
    title: "Compress PDF",
    description: "Reduce PDF size while keeping it readable.",
    icon: Minimize2,
    accent: "red" as const,
  },
  {
    href: "/reorder",
    title: "Reorder PDF",
    description: "Drag pages into a new sequence and save.",
    icon: ArrowUpDown,
    accent: "red" as const,
  },
  {
    href: "/word-to-pdf",
    title: "Word to PDF",
    description: "Convert DOCX files to PDF in your browser.",
    icon: FileText,
    accent: "blue" as const,
  },
  {
    href: "/pdf-to-word",
    title: "PDF to Word",
    description: "Convert PDF content into editable Word format.",
    icon: FileText,
    accent: "red" as const,
  },
  {
    href: "/image-to-pdf",
    title: "Image to PDF",
    description: "Turn images into one ordered PDF document.",
    icon: ImageIcon,
    accent: "blue" as const,
  },
  {
    href: "/jpg-to-pdf",
    title: "JPG to PDF",
    description: "Convert JPG images into a single PDF file.",
    icon: ImageIcon,
    accent: "blue" as const,
  },
  {
    href: "/png-to-pdf",
    title: "PNG to PDF",
    description: "Convert PNG images into one ordered PDF.",
    icon: ImageIcon,
    accent: "red" as const,
  },
  {
    href: "/pdf-to-jpg",
    title: "PDF to JPG",
    description: "Export each PDF page as a JPG image.",
    icon: ImageIcon,
    accent: "blue" as const,
  },
  {
    href: "/pdf-to-png",
    title: "PDF to PNG",
    description: "Convert PDF pages into high-quality PNG files.",
    icon: ImageIcon,
    accent: "red" as const,
  },
  {
    href: "/pdf-to-text",
    title: "PDF to Text",
    description: "Extract text from PDFs for quick copy/edit use.",
    icon: FileText,
    accent: "blue" as const,
  },
  {
    href: "/sign-pdf",
    title: "Sign PDF",
    description: "Draw or type initials and place signatures.",
    icon: PenLine,
    accent: "red" as const,
  },
  {
    href: "/redact-pdf",
    title: "Redact PDF",
    description: "Permanently black out sensitive text and areas in your PDF.",
    icon: Shield,
    accent: "blue" as const,
  },
  {
    href: "/tools/pdf-page-counter",
    title: "PDF page counter",
    description: "Instantly count pages in your PDF — runs in your browser.",
    icon: Calculator,
    accent: "blue" as const,
  },
  {
    href: "/tools/pdf-metadata-viewer",
    title: "PDF metadata viewer",
    description: "See PDF title, author, creator, and more — locally in your browser.",
    icon: FileSearch,
    accent: "red" as const,
  },
  {
    href: "/tools/pdf-file-size-checker",
    title: "PDF file size checker",
    description: "Quickly check PDF file size and share-ready limits — no upload.",
    icon: Shrink,
    accent: "blue" as const,
  },
  {
    href: "/tools/image-to-text",
    title: "Image to Text (OCR)",
    description: "Extract text from images using OCR in-browser.",
    icon: ScanText,
    accent: "red" as const,
  },
  {
    href: "/tools/qr-code-generator",
    title: "QR code generator",
    description: "Generate and download QR codes for URLs, text, and more.",
    icon: QrCode,
    accent: "blue" as const,
  },
];

const sectionedTools = [
  {
    title: "PDF Tools",
    description: "Core editing and document workflow tools.",
    hrefs: ["/merge", "/split", "/rotate", "/compress", "/reorder", "/sign-pdf", "/redact-pdf"],
  },
  {
    title: "Convert",
    description: "Convert PDFs and images between common formats.",
    hrefs: [
      "/word-to-pdf",
      "/pdf-to-word",
      "/image-to-pdf",
      "/jpg-to-pdf",
      "/png-to-pdf",
      "/pdf-to-jpg",
      "/pdf-to-png",
      "/pdf-to-text",
    ],
  },
  {
    title: "Utilities",
    description: "Quick helper tools for OCR, QR, metadata, and checks.",
    hrefs: [
      "/tools/image-to-text",
      "/tools/qr-code-generator",
      "/tools/pdf-page-counter",
      "/tools/pdf-metadata-viewer",
      "/tools/pdf-file-size-checker",
    ],
  },
];

export default function HomePage() {
  return (
    <div className="page-wrap animate-fadeIn space-y-10">
      {/* Hero */}
      <section className="space-y-4 py-6 text-center sm:py-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          Every PDF tool you need. Private by design.
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-gray-600 dark:text-gray-400">
          Merge, split, convert, sign, and redact in your browser. Your files stay on your device.
        </p>
      </section>

      {/* Tools grid */}
      <section id="tools" className="space-y-4">
        {sectionedTools.map((section) => (
          <section key={section.title} className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
              {section.hrefs
                .map((href) => tools.find((tool) => tool.href === href))
                .filter(Boolean)
                .map((tool) => {
                  const t = tool!;
                  const Icon = t.icon;
                  const iconClass =
                    t.accent === "red" ? "bg-toolRed/10 text-toolRed" : "bg-toolBlue/10 text-toolBlue";
                  return (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="group rounded-xl border border-border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                    >
                      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t.title}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t.description}</p>
                    </Link>
                  );
                })}
            </div>
          </section>
        ))}
      </section>

      {/* Value props strip */}
      <section className="grid gap-3 rounded-xl border border-border bg-white/80 px-4 py-3 text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 sm:grid-cols-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          <p className="font-medium">100% browser-based</p>
        </div>
        <div className="flex items-center gap-2 border-t border-border pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 dark:border-gray-700">
          <Zap className="h-4 w-4 text-primary" />
          <p className="font-medium">Lightning fast</p>
        </div>
        <div className="flex items-center gap-2 border-t border-border pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 dark:border-gray-700">
          <Gauge className="h-4 w-4 text-primary" />
          <p className="font-medium">Built for daily work</p>
        </div>
      </section>

      {/* Compact trust block */}
      <section className="space-y-3 rounded-xl border border-border bg-white p-4 text-sm dark:border-gray-700 dark:bg-gray-900">
        <p className="text-gray-900 dark:text-white">
          &ldquo;We process dozens of student PDFs every day. PleaseFixMyPDF is the only tool that stays fast and
          doesn&apos;t send files anywhere.&rdquo;
          <span className="ml-2 text-gray-600 dark:text-gray-400">— Cloud Education team</span>
        </p>
        <p className="border-t border-border pt-3 text-gray-900 dark:border-gray-700 dark:text-white">
          &ldquo;Client-side processing is essential for our document workflows. PleaseFixMyPDF gives us that privacy
          and reliability, which is why we chose it.&rdquo;
          <span className="ml-2 text-gray-600 dark:text-gray-400">— AD</span>
        </p>
      </section>
    </div>
  );
}
