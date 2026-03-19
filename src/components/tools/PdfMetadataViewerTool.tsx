"use client";

import { useState } from "react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { getPdfMetadata, type PdfMetadata } from "@/lib/pdf/pdfInfo";
import { fileToUint8Array, formatFileSize, getFriendlyPdfError } from "@/lib/utils";

function formatDate(d: Date | string | undefined): string {
  if (d == null) return "—";
  if (typeof d === "string") return d;
  return d.toISOString().replace("T", " ").slice(0, 19);
}

export function PdfMetadataViewerTool() {
  const [result, setResult] = useState<{ meta: PdfMetadata; fileName: string; fileSize: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setError(null);
    setResult(null);
    try {
      const bytes = await fileToUint8Array(file);
      const meta = await getPdfMetadata(bytes);
      setResult({ meta, fileName: file.name, fileSize: file.size });
    } catch (err) {
      setError(getFriendlyPdfError(err));
    }
  }

  const rows = result
    ? [
        { label: "File name", value: result.fileName },
        { label: "File size", value: formatFileSize(result.fileSize) },
        { label: "Pages", value: String(result.meta.pageCount) },
        { label: "Title", value: result.meta.title ?? "—" },
        { label: "Author", value: result.meta.author ?? "—" },
        { label: "Subject", value: result.meta.subject ?? "—" },
        { label: "Creator", value: result.meta.creator ?? "—" },
        { label: "Producer", value: result.meta.producer ?? "—" },
        { label: "Keywords", value: result.meta.keywords ?? "—" },
        { label: "Creation date", value: formatDate(result.meta.creationDate) },
        { label: "Modification date", value: formatDate(result.meta.modificationDate) },
      ]
    : [];

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
        helperText="Select a PDF to view its metadata and properties."
        showProBatchHint
      />

      {result ? (
        <div className="rounded-xl border border-border bg-white overflow-hidden dark:bg-gray-900 dark:border-gray-700">
          <table className="w-full text-left text-sm">
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-border dark:border-gray-700 last:border-0"
                >
                  <th className="w-40 shrink-0 py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    {row.label}
                  </th>
                  <td className="py-3 px-4 text-gray-900 dark:text-white break-all">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
