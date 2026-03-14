"use client";

import { Download } from "lucide-react";

import { downloadPDF } from "@/lib/utils";

export function DownloadButton({
  pdfBytes,
  filename,
  disabled,
}: {
  pdfBytes: Uint8Array;
  filename: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => downloadPDF(pdfBytes, filename)}
      className="primary-button inline-flex gap-2"
    >
      <Download className="h-4 w-4" />
      Download PDF
    </button>
  );
}
