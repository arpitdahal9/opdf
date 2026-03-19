"use client";

import { useState } from "react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { fileToUint8Array, formatFileSize, getFriendlyPdfError } from "@/lib/utils";

export function PdfFileSizeCheckerTool() {
  const [result, setResult] = useState<{ fileName: string; fileSize: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setError(null);
    setResult(null);
    try {
      await fileToUint8Array(file);
      setResult({ fileName: file.name, fileSize: file.size });
    } catch (err) {
      setError(getFriendlyPdfError(err));
    }
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <FileDropzone
        multiple={false}
        accept="application/pdf"
        onFilesSelected={handleFile}
        helperText="Select a PDF to check its file size."
        showProBatchHint
      />

      {result ? (
        <div className="rounded-xl border border-border bg-white p-6 dark:bg-gray-900 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">{result.fileName}</p>
          <p className="mt-4 text-3xl font-bold text-primary">{formatFileSize(result.fileSize)}</p>
        </div>
      ) : null}
    </div>
  );
}
