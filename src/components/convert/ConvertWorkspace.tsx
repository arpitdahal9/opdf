"use client";

import { useState } from "react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import { pdfToWord } from "@/lib/pdf/pdfToWord";
import { wordToPdf } from "@/lib/pdf/wordToPdf";
import { downloadBytes, downloadPDF, formatFileSize, getFriendlyPdfError, fileToUint8Array } from "@/lib/utils";

type Mode = "word-to-pdf" | "pdf-to-word";

type ConvertWorkspaceProps = {
  /** When set, only this mode is available and the mode toggle is hidden. */
  fixedMode?: Mode;
  /** Override page title (e.g. "Word to PDF Converter"). */
  title?: string;
  /** Override description. */
  description?: string;
};

export function ConvertWorkspace({ fixedMode, title, description }: ConvertWorkspaceProps = {}) {
  const [mode, setMode] = useState<Mode>(fixedMode ?? "word-to-pdf");
  const [file, setFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveMode = fixedMode ?? mode;
  const showToggle = fixedMode == null;

  const handleFilesSelected = (files: File[]) => {
    const nextFile = files[0];
    setFile(nextFile);
    setFileInfo({ name: nextFile.name, size: nextFile.size });
    setError(null);
  };

  const runConversion = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);

    try {
      const bytes = await fileToUint8Array(file);
      if (effectiveMode === "word-to-pdf") {
        const output = await wordToPdf(bytes);
        const filename = file.name.toLowerCase().endsWith(".pdf")
          ? file.name
          : `${file.name.replace(/\.docx$/i, "") || "document"}.pdf`;
        downloadPDF(output, filename);
      } else {
        const output = await pdfToWord(bytes);
        const filename = file.name.toLowerCase().endsWith(".docx")
          ? file.name
          : `${file.name.replace(/\.pdf$/i, "") || "document"}.docx`;
        downloadBytes(
          output,
          filename,
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        );
      }
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setProcessing(false);
    }
  };

  const isWordToPdf = effectiveMode === "word-to-pdf";
  const accept = isWordToPdf
    ? ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    : "application/pdf";

  const heading = title ?? "Word ↔ PDF Converter";
  const subtext =
    description ??
    "Convert Word to PDF or PDF to Word. 100% in your browser—no uploads to servers.";

  return (
    <div className="page-wrap animate-fadeIn space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{heading}</h1>
        <p className="max-w-2xl text-ink-muted dark:text-slate-300">{subtext}</p>
      </section>

      <section className="glass-panel flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {showToggle ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={isWordToPdf ? "primary-button" : "secondary-button"}
                onClick={() => {
                  setMode("word-to-pdf");
                  setError(null);
                }}
              >
                Word to PDF
              </button>
              <button
                type="button"
                className={!isWordToPdf ? "primary-button" : "secondary-button"}
                onClick={() => {
                  setMode("pdf-to-word");
                  setError(null);
                }}
              >
                PDF to Word
              </button>
            </div>
          ) : null}
          {fileInfo ? (
            <div className="text-xs text-ink-muted dark:text-slate-300">
              <span className="font-semibold text-gray-900 dark:text-white">This file selected:</span>{" "}
              <span className="ml-1">{fileInfo.name}</span>
              <span className="ml-2 text-ink-muted">({formatFileSize(fileInfo.size)})</span>
            </div>
          ) : (
            <div className="text-xs text-ink-muted dark:text-slate-400">
              No file selected yet
            </div>
          )}
        </div>
      </section>

      <FileDropzone
        multiple={false}
        onFilesSelected={handleFilesSelected}
        accept={accept}
        label={isWordToPdf ? "Drop DOCX here or click to browse" : "Drop PDF here or click to browse"}
        helperText={
          isWordToPdf
            ? "Upload a .docx Word document (max 100 MB)."
            : "Upload a PDF document to extract its text into a .docx file."
        }
      />

      {fileInfo ? (
        <section className="card-surface flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Ready to convert</p>
            <p className="text-xs text-ink-muted dark:text-slate-300">
              {fileInfo.name} · {formatFileSize(fileInfo.size)}
            </p>
          </div>
          <button
            type="button"
            className="primary-button"
            disabled={!file || processing}
            onClick={() => void runConversion()}
          >
            Convert this file
          </button>
        </section>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {processing ? (
        <ProcessingSpinner
          label={isWordToPdf ? "Converting Word to PDF..." : "Converting PDF to Word..."}
        />
      ) : null}
    </div>
  );
}

