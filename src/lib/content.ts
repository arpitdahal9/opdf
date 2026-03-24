/**
 * Central content layer for tools and conversions — used by /tools hub and sitemap.
 */

export interface ToolItem {
  slug: string;
  path: string;
  name: string;
  description: string;
}

export interface ConversionItem {
  slug: string;
  path: string;
  name: string;
  description: string;
  fromLabel: string;
  toLabel: string;
}

export const allTools: ToolItem[] = [
  {
    slug: "merge",
    path: "/merge",
    name: "Merge PDF",
    description: "Combine multiple PDFs into one document. Private, no upload.",
  },
  {
    slug: "split",
    path: "/split",
    name: "Split PDF",
    description: "Extract pages from a PDF. Select pages or ranges.",
  },
  {
    slug: "rotate",
    path: "/rotate",
    name: "Rotate PDF",
    description: "Rotate PDF pages 90°, 180°, or 270°.",
  },
  {
    slug: "reorder",
    path: "/reorder",
    name: "Reorder PDF",
    description: "Drag and drop to rearrange PDF pages.",
  },
  {
    slug: "compress",
    path: "/compress",
    name: "Compress PDF",
    description: "Reduce PDF file size. Works in your browser.",
  },
  {
    slug: "sign-pdf",
    path: "/sign-pdf",
    name: "Sign PDF",
    description: "Draw and apply a signature to every page of a PDF.",
  },
  {
    slug: "redact-pdf",
    path: "/redact-pdf",
    name: "Redact PDF",
    description: "Permanently black out sensitive text and areas in your PDF.",
  },
];

export const allConversions: ConversionItem[] = [
  {
    slug: "word-to-pdf",
    path: "/word-to-pdf",
    name: "Word to PDF",
    description: "Convert Word documents to PDF. No upload.",
    fromLabel: "Word",
    toLabel: "PDF",
  },
  {
    slug: "pdf-to-word",
    path: "/pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF to editable Word. No upload.",
    fromLabel: "PDF",
    toLabel: "Word",
  },
  {
    slug: "image-to-pdf",
    path: "/image-to-pdf",
    name: "Image to PDF",
    description: "Convert JPG, PNG, or photos to PDF. No upload.",
    fromLabel: "Image",
    toLabel: "PDF",
  },
  {
    slug: "pdf-to-jpg",
    path: "/pdf-to-jpg",
    name: "PDF to JPG",
    description: "Convert each PDF page to a JPG image. No upload.",
    fromLabel: "PDF",
    toLabel: "JPG",
  },
  {
    slug: "pdf-to-png",
    path: "/pdf-to-png",
    name: "PDF to PNG",
    description: "Convert each PDF page to a PNG image. No upload.",
    fromLabel: "PDF",
    toLabel: "PNG",
  },
  {
    slug: "jpg-to-pdf",
    path: "/jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert JPG images into a single, ordered PDF. No upload.",
    fromLabel: "JPG",
    toLabel: "PDF",
  },
  {
    slug: "png-to-pdf",
    path: "/png-to-pdf",
    name: "PNG to PDF",
    description: "Convert PNG images into a single, ordered PDF. No upload.",
    fromLabel: "PNG",
    toLabel: "PDF",
  },
  {
    slug: "pdf-to-text",
    path: "/pdf-to-text",
    name: "PDF to Text",
    description: "Extract text from PDF or turn text into a simple PDF. No upload.",
    fromLabel: "PDF",
    toLabel: "Text",
  },
];

/** All tool paths (for sitemap and nav). */
export const allToolPaths: string[] = allTools.map((t) => t.path);

/** All conversion paths (for sitemap and nav). */
export const allConversionPaths: string[] = allConversions.map((c) => c.path);

/** Static routes that are not tools or conversions. */
/** Micro-tools (small utilities). */
export const microToolPaths = [
  "/tools/pdf-page-counter",
  "/tools/pdf-metadata-viewer",
  "/tools/pdf-file-size-checker",
  "/tools/image-to-text",
  "/tools/qr-code-generator",
];

/** Compare and alternative page paths. */
export const comparePaths = [
  "/compare/pleasefixmypdf-vs-ilovepdf",
  "/compare/pleasefixmypdf-vs-smallpdf",
];
export const alternativePaths = ["/alternatives/ilovepdf-alternatives"];

/** Audience / use-case page paths. */
export const audiencePaths = ["/for/students", "/for/legal", "/for/healthcare"];

/** Static routes that are not tools or conversions. */
export const staticRoutes = [
  "",
  "/converter",
  "/about",
  "/pricing",
  "/delete-pdf-pages",
  "/extract-pdf-pages",
  "/organize-pdf",
];
