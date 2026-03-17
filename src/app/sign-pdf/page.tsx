import type { Metadata } from "next";

import { SignPdfWorkspace } from "@/components/sign/SignPdfWorkspace";
import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { FAQSection } from "@/components/shared/FAQSection";

export const metadata: Metadata = {
  title: "Sign PDF Online — Draw and Stamp Your Signature",
  description:
    "Draw a signature and apply it to every page of a PDF directly in your browser. Powered by pdf-lib, private and fast.",
  alternates: { canonical: "https://pleasefixmypdf.com/sign-pdf/" },
  openGraph: {
    title: "Sign PDF Online — Draw and Stamp Your Signature",
    description:
      "Sign PDFs in your browser: draw a signature and stamp it onto every page with pdf-lib, no uploads required.",
    url: "https://pleasefixmypdf.com/sign-pdf/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Edit", url: "/tools" },
  { name: "Sign PDF", url: "/sign-pdf" },
];

const faqs = [
  {
    question: "Is my signed PDF processed locally?",
    answer:
      "Yes. The PDF is loaded and modified directly in your browser using pdf-lib. Your files never leave your device.",
  },
  {
    question: "Where does the signature appear?",
    answer:
      "Your drawn signature is embedded as an image near the bottom-right corner of every page in the PDF.",
  },
];

export default function SignPdfPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <SignPdfWorkspace />
      <div className="page-wrap mx-auto max-w-4xl space-y-10 px-4 pb-12">
        <FAQSection items={faqs} />
      </div>
    </>
  );
}

