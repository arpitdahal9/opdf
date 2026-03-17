/**
 * Blog posts for SEO — Tier 1 "how to" and informational articles.
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  h1: string;
  updatedAt: string; // ISO date
  faqs: { question: string; answer: string }[];
  /** Tool page paths to link to (internal links). */
  toolLinks: { href: string; label: string }[];
  /** Body: paragraphs as array of strings (each becomes a <p>). */
  body: string[];
}

export const allBlogPosts: BlogPost[] = [
  {
    slug: "how-to-merge-pdf-files",
    title: "How to merge PDF files for free — step-by-step | PleaseFixMyPDF",
    description:
      "Learn how to combine multiple PDFs into one document in your browser. No uploads, no signup. Step-by-step guide with screenshots.",
    h1: "How to merge PDF files for free",
    updatedAt: "2025-03-01",
    faqs: [
      {
        question: "Can I merge PDFs without uploading them?",
        answer:
          "Yes. PleaseFixMyPDF runs entirely in your browser. Your files never leave your device.",
      },
      {
        question: "How many PDFs can I merge at once?",
        answer:
          "You can add as many PDFs as you need. Reorder pages by dragging, then click Merge PDFs to download one file.",
      },
    ],
    toolLinks: [
      { href: "/merge", label: "Merge PDF" },
      { href: "/split", label: "Split PDF" },
      { href: "/reorder", label: "Reorder PDF" },
    ],
    body: [
      "Merging PDFs is simple: open the merge tool, add your files, arrange the page order, and download a single combined PDF. No account or upload to a server required.",
      "Step 1: Open the Merge PDF tool and add your PDF files (drag and drop or click to select). Step 2: Use the “By file” or “All pages” view to see thumbnails. Drag pages to change order. Step 3: Click “Merge PDFs” to create one PDF and download it. Everything runs in your browser, so your documents stay private.",
      "PleaseFixMyPDF processes files locally. Unlike many online tools that upload your PDFs to their servers, we never see your data. That makes it a good choice for sensitive or work documents.",
    ],
  },
  {
    slug: "how-to-compress-pdf",
    title: "How to compress a PDF and reduce file size | PleaseFixMyPDF",
    description:
      "Reduce PDF file size without losing quality. Compress PDFs in your browser. No upload, private.",
    h1: "How to compress a PDF",
    updatedAt: "2025-03-01",
    faqs: [
      {
        question: "Is it safe to compress PDF online?",
        answer:
          "With PleaseFixMyPDF, yes — compression happens in your browser. Your file is never sent to a server.",
      },
      {
        question: "Will compressing a PDF reduce quality?",
        answer:
          "We optimise images and structure to shrink file size while keeping text sharp. For best quality, avoid over-compressing.",
      },
    ],
    toolLinks: [
      { href: "/compress", label: "Compress PDF" },
      { href: "/merge", label: "Merge PDF" },
      { href: "/image-to-pdf", label: "Image to PDF" },
    ],
    body: [
      "To compress a PDF, open our Compress PDF tool, add your file, and download the smaller version. Processing runs in your browser, so your document stays on your device.",
      "Step 1: Go to the Compress PDF tool. Step 2: Select your PDF (or drag and drop). Step 3: Wait for the optimised file to be generated, then download. No signup or server upload required.",
      "We use client-side processing so your files never leave your computer. That’s ideal for confidential or work documents compared to tools that upload to the cloud.",
    ],
  },
  {
    slug: "how-to-split-pdf-files",
    title: "How to split PDF files — extract pages easily | PleaseFixMyPDF",
    description:
      "Split a PDF into separate files or extract specific pages. Free, in-browser. No upload needed.",
    h1: "How to split PDF files",
    updatedAt: "2025-03-01",
    faqs: [
      {
        question: "Can I extract a range of pages from a PDF?",
        answer:
          "Yes. Select individual pages or ranges (e.g. 1–5, 8, 12–15). Each selection can be downloaded as its own PDF.",
      },
      {
        question: "Do I need to upload my PDF to split it?",
        answer:
          "No. PleaseFixMyPDF runs in your browser. Your PDF is processed locally and never sent to our servers.",
      },
    ],
    toolLinks: [
      { href: "/split", label: "Split PDF" },
      { href: "/merge", label: "Merge PDF" },
      { href: "/reorder", label: "Reorder PDF" },
    ],
    body: [
      "Splitting a PDF means turning one file into several, or saving only certain pages. Use the Split PDF tool, choose the pages you want, and download the result.",
      "Step 1: Open the Split PDF tool and add your PDF. Step 2: Select the pages to extract (click or use ranges). Step 3: Download one PDF per selection or combine as you like. All processing is done in your browser.",
      "Because we don’t upload your file to a server, splitting is private and fast. Suited for contracts, reports, or any document you don’t want to send to a third party.",
    ],
  },
  {
    slug: "what-is-a-pdf",
    title: "What is a PDF? Definition and why we use them | PleaseFixMyPDF",
    description:
      "What is a PDF file? How it works, why it’s used, and how to edit or convert PDFs. Simple guide.",
    h1: "What is a PDF?",
    updatedAt: "2025-03-01",
    faqs: [
      {
        question: "What does PDF stand for?",
        answer: "PDF stands for Portable Document Format. It’s a file type that keeps layout and formatting the same on any device.",
      },
      {
        question: "Can I edit a PDF for free?",
        answer:
          "Yes. You can merge, split, rotate, reorder, and compress PDFs with PleaseFixMyPDF in your browser, with no upload.",
      },
    ],
    toolLinks: [
      { href: "/merge", label: "Merge PDF" },
      { href: "/compress", label: "Compress PDF" },
      { href: "/word-to-pdf", label: "Word to PDF" },
    ],
    body: [
      "A PDF (Portable Document Format) is a file format that keeps text, images, and layout the same no matter which device or app opens it. It’s widely used for forms, contracts, and sharing documents.",
      "PDFs are designed to look the same everywhere. That’s why they’re common for official documents, applications, and anything that must not change when opened on another computer or phone.",
      "You can create PDFs from Word, images, or other apps. You can also merge, split, compress, or convert them with tools like PleaseFixMyPDF, which runs in your browser so your files stay private.",
    ],
  },
  {
    slug: "how-to-convert-word-to-pdf",
    title: "How to convert Word to PDF online — free | PleaseFixMyPDF",
    description:
      "Convert Word documents to PDF in your browser. No upload. Step-by-step guide to DOCX to PDF.",
    h1: "How to convert Word to PDF online",
    updatedAt: "2025-03-01",
    faqs: [
      {
        question: "Is Word to PDF conversion free?",
        answer:
          "Yes. PleaseFixMyPDF lets you convert Word to PDF in your browser with no signup. Limits may apply on the free tier.",
      },
      {
        question: "Do my files get uploaded?",
        answer:
          "No. Conversion runs in your browser. Your Word document never leaves your device.",
      },
    ],
    toolLinks: [
      { href: "/word-to-pdf", label: "Word to PDF" },
      { href: "/pdf-to-word", label: "PDF to Word" },
      { href: "/merge", label: "Merge PDF" },
    ],
    body: [
      "To convert Word to PDF, open our Word to PDF tool, select your .docx or .doc file, and download the PDF. Everything runs in your browser.",
      "Step 1: Go to Word to PDF. Step 2: Choose your Word file (or drag and drop). Step 3: Click convert and download your PDF. No upload to a server — the file is processed locally.",
      "PleaseFixMyPDF keeps your document on your device. That’s different from many online converters that upload your file to their servers, which can be a concern for confidential documents.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return allBlogPosts.find((p) => p.slug === slug);
}

export const blogSlugs = allBlogPosts.map((p) => p.slug);
