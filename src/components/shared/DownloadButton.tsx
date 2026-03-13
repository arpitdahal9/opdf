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
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-success px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download className="h-4 w-4" />
      Download PDF
    </button>
  );
}
