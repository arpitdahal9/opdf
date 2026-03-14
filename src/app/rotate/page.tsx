import type { Metadata } from "next";

import { RotateWorkspace } from "@/components/rotate/RotateWorkspace";

export const metadata: Metadata = {
  title: "Rotate PDF Pages Online ? Free, Private, No Upload",
  description:
    "Rotate individual or all PDF pages with instant previews right in your browser. No uploads required.",
  alternates: { canonical: "/rotate" },
  openGraph: {
    title: "Rotate PDF Pages Online ? Free, Private, No Upload | PleaseFixMyPDF.com",
    description:
      "Rotate individual or all PDF pages with instant previews right in your browser. No uploads required.",
    url: "/rotate",
  },
};

export default function RotatePage() {
  return <RotateWorkspace />;
}
