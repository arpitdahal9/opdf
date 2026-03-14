import type { Metadata } from "next";

import { SplitWorkspace } from "@/components/split/SplitWorkspace";

export const metadata: Metadata = {
  title: "Split PDF Pages Online ? Free, Private, No Upload",
  description:
    "Extract specific pages or split a PDF by custom ranges in your browser. Private, fast, and fully client-side.",
  alternates: { canonical: "/split" },
  openGraph: {
    title: "Split PDF Pages Online ? Free, Private, No Upload | PleaseFixMyPDF.com",
    description:
      "Extract specific pages or split a PDF by custom ranges in your browser. Private, fast, and fully client-side.",
    url: "/split",
  },
};

export default function SplitPage() {
  return <SplitWorkspace />;
}
