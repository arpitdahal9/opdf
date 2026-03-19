"use client";

import { useState } from "react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ProcessingResultStats } from "@/components/shared/ProcessingResultStats";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import { compressPdf, type CompressionLevel } from "@/lib/pdf/compressPdf";
import { downloadPDF, getFriendlyPdfError } from "@/lib/utils";

export function CompressWorkspace() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("high");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [processingTimeMs, setProcessingTimeMs] = useState<number | null>(null);

  const handleFilesSelected = (files: File[]) => {
    const nextFile = files[0];
    setFile(nextFile);
    setOriginalSize(nextFile.size);
    setResultSize(null);
    setPageCount(null);
    setProcessingTimeMs(null);
    setNote(null);
    setProgress(null);
    setError(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setResultSize(null);
    setNote(null);
    setProgress(null);
    setProcessingTimeMs(null);

    const startMs = performance.now();

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await compressPdf({
        file: arrayBuffer,
        level: compressionLevel,
        onProgress: (current, total) => {
          const percent = Math.round((current / total) * 100);
          setProgress(percent);
          setPageCount((prev) => prev ?? total);
        },
      });

      setOriginalSize(result.originalSize);

      const shouldUseOriginal = result.compressedSize >= result.originalSize;

      if (shouldUseOriginal) {
        setResultSize(result.originalSize);
        setNote(
          "This PDF couldn't be reduced further. Text‑only or already optimised PDFs may not compress much, so you'll get the original file back.",
        );

        const originalBytes = new Uint8Array(arrayBuffer);
        const filename = file.name || "original.pdf";
        downloadPDF(originalBytes, filename);
      } else {
        setResultSize(result.compressedSize);

        if (result.reductionPercent < 5) {
          setNote("This PDF was already fairly small. Compression only helped a little.");
        }

        const filename = file.name
          ? file.name.replace(/\.pdf$/i, "") + "_compressed.pdf"
          : "compressed.pdf";
        downloadPDF(result.data, filename);
      }

      setProcessingTimeMs(performance.now() - startMs);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setProcessing(false);
      setProgress(null);
    }
  };

  const reductionPercent =
    originalSize != null && resultSize != null && resultSize < originalSize
      ? Math.round(((originalSize - resultSize) / originalSize) * 100)
      : null;

  return (
    <div className="page-wrap animate-fadeIn space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">Compress PDF</h1>
        <p className="max-w-2xl text-ink-muted dark:text-slate-300">
          Reduce PDF file size without leaving your browser. Pages are rendered and rebuilt so images can be heavily compressed while keeping things readable.
        </p>
      </section>

      <section className="glass-panel flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-white">Compression level</p>
          <p className="text-xs text-ink-muted">
            Medium keeps more detail. High is more aggressive and usually gives the smallest files.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["medium", "high"] as CompressionLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              className={compressionLevel === level ? "primary-button" : "secondary-button"}
              onClick={() => setCompressionLevel(level)}
            >
              {level === "medium" && "Medium"}
              {level === "high" && "High"}
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
        showProBatchHint
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

      {processing ? (
        <ProcessingSpinner
          label={progress !== null ? `Compressing your PDF (${progress}%)...` : "Compressing your PDF..."}
        />
      ) : null}

      {resultSize != null ? (
        <ProcessingResultStats
          beforeSize={originalSize}
          afterSize={resultSize}
          afterLabel="Compressed"
          pageCount={pageCount}
          processingTimeMs={processingTimeMs}
          reductionPercent={reductionPercent}
        />
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

