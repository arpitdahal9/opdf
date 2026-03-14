"use client";

import { useState } from "react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import { compressPdf, type CompressionLevel } from "@/lib/pdf/compressPdf";
import { downloadPDF, formatFileSize, getFriendlyPdfError, fileToUint8Array } from "@/lib/utils";

export function CompressWorkspace() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("medium");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    const nextFile = files[0];
    setFile(nextFile);
    setOriginalSize(nextFile.size);
    setResultSize(null);
    setNote(null);
    setError(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setResultSize(null);
    setNote(null);

    try {
      if (file.size < 500 * 1024) {
        setNote("This PDF is already small. Compression may not help much.");
      }

      const bytes = await fileToUint8Array(file);
      const compressed = await compressPdf(bytes, compressionLevel);
      setResultSize(compressed.byteLength);
      const filename = file.name
        ? file.name.replace(/\.pdf$/i, "") + "_compressed.pdf"
        : "compressed.pdf";
      downloadPDF(compressed, filename);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setProcessing(false);
    }
  };

  const beforeSize = originalSize ?? 0;
  const afterSize = resultSize ?? 0;
  const reduction =
    beforeSize && afterSize && afterSize < beforeSize
      ? Math.round(((beforeSize - afterSize) / beforeSize) * 100)
      : null;

  return (
    <div className="page-wrap animate-fadeIn space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">Compress PDF Free</h1>
        <p className="max-w-2xl text-ink-muted dark:text-slate-300">
          Reduce PDF file size without leaving your browser. Strip metadata and let pdf-lib compress the content.
        </p>
      </section>

      <section className="glass-panel flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-white">Compression level</p>
          <p className="text-xs text-ink-muted">
            Low keeps maximum quality. High may significantly reduce file size.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["low", "medium", "high"] as CompressionLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              className={compressionLevel === level ? "primary-button" : "secondary-button"}
              onClick={() => setCompressionLevel(level)}
            >
              {level === "low" && "Low (10%)"}
              {level === "medium" && "Medium (25%)"}
              {level === "high" && "High (40%)"}
            </button>
          ))}
        </div>
      </section>

      <FileDropzone
        multiple={false}
        onFilesSelected={handleFilesSelected}
        accept="application/pdf"
        label="Drop PDF here or click to browse"
        helperText="Upload a single PDF up to 100 MB."
      />

      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {note ? (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {note}
        </div>
      ) : null}

      {processing ? <ProcessingSpinner label="Compressing your PDF..." /> : null}

      {beforeSize ? (
        <div className="glass-panel flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
          <div className="space-y-1">
            <p className="font-semibold text-white">File size</p>
            <p className="text-ink-muted">
              Original: {formatFileSize(beforeSize)}
              {afterSize ? ` · Compressed: ${formatFileSize(afterSize)}` : null}
            </p>
          </div>
          {reduction !== null && (
            <p className="text-sm font-semibold text-emerald-400">
              Reduced by {reduction}%.
            </p>
          )}
        </div>
      ) : null}

      <div className="flex justify-end">
        <button
          type="button"
          className="primary-button"
          disabled={!file || processing}
          onClick={() => void handleCompress()}
        >
          Compress PDF
        </button>
      </div>
    </div>
  );
}

