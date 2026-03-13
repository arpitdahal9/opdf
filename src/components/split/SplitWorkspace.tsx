"use client";

import { useMemo, useState } from "react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { PageThumbnail } from "@/components/shared/PageThumbnail";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import { splitPDF } from "@/lib/pdf/split";
import { buildPageFilename, getFriendlyPdfError, loadPdfFile, parsePageRange } from "@/lib/utils";
import type { PdfDocumentState } from "@/types/pdf";

export function SplitWorkspace() {
  const [document, setDocument] = useState<PdfDocumentState | null>(null);
  const [mode, setMode] = useState<"select" | "range">("select");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [rangeInput, setRangeInput] = useState("");
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [resultFilename, setResultFilename] = useState("split.pdf");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rangeState = useMemo(() => {
    if (!document) {
      return { indices: [], normalized: "", error: null as string | null };
    }
    return parsePageRange(rangeInput, document.pageCount);
  }, [document, rangeInput]);

  const activeIndices = mode === "select" ? selectedPages : rangeState.indices;

  const resetDocument = () => {
    setDocument(null);
    setSelectedPages([]);
    setRangeInput("");
    setResult(null);
    setError(null);
  };

  const handleFile = async (files: File[]) => {
    try {
      const nextDocument = await loadPdfFile(files[0]);
      setDocument(nextDocument);
      setSelectedPages([]);
      setRangeInput("");
      setResult(null);
      setError(null);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    }
  };

  const runSplit = async (indices: number[], filename: string) => {
    if (!document || !indices.length) {
      return;
    }

    setProcessing(true);
    setError(null);
    try {
      const pdfBytes = await splitPDF(document.bytes, indices);
      setResult(pdfBytes);
      setResultFilename(filename);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-wrap animate-fadeIn space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">Split PDF pages</h1>
        <p className="max-w-2xl text-ink-muted dark:text-slate-300">
          Extract specific pages by clicking them directly or enter a custom page range like 1-3, 5, 8-12.
        </p>
      </section>

      {!document ? (
        <FileDropzone multiple={false} onFilesSelected={handleFile} />
      ) : (
        <div className="card-surface flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="font-semibold">{document.name}</p>
            <p className="text-sm text-ink-muted dark:text-slate-300">
              {document.pageCount} pages ready to split.
            </p>
          </div>
          <button type="button" className="secondary-button" onClick={resetDocument}>
            Try another file
          </button>
        </div>
      )}

      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {document ? (
        <>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={mode === "select" ? "primary-button" : "secondary-button"}
              onClick={() => setMode("select")}
            >
              Select Pages
            </button>
            <button
              type="button"
              className={mode === "range" ? "primary-button" : "secondary-button"}
              onClick={() => setMode("range")}
            >
              Page Range
            </button>
          </div>

          {mode === "select" ? (
            <div className="card-surface space-y-4 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">Select pages to extract</h2>
                  <p className="text-sm text-ink-muted dark:text-slate-300">
                    Click thumbnails to toggle individual pages.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      setSelectedPages(Array.from({ length: document.pageCount }, (_, index) => index))
                    }
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setSelectedPages([])}
                  >
                    Deselect All
                  </button>
                  <button
                    type="button"
                    className="primary-button"
                    disabled={!selectedPages.length || processing}
                    onClick={() =>
                      void runSplit(
                        selectedPages,
                        buildPageFilename(
                          document.baseName,
                          `pages_${selectedPages.map((index) => index + 1).join("-")}`,
                        ),
                      )
                    }
                  >
                    Extract Selected
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card-surface space-y-4 p-5">
              <div className="space-y-2">
                <label htmlFor="page-range" className="font-semibold">
                  Enter page ranges
                </label>
                <input
                  id="page-range"
                  className={`field-input ${rangeState.error ? "border-danger focus:ring-danger/20" : ""}`}
                  placeholder="1-3, 5, 8-12"
                  value={rangeInput}
                  onChange={(event) => setRangeInput(event.target.value)}
                />
                <p className="text-sm text-ink-muted dark:text-slate-300">
                  Accepted formats: single pages, ranges, commas, and spaces.
                </p>
                {rangeState.error ? <p className="text-sm text-danger">{rangeState.error}</p> : null}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="primary-button"
                  disabled={Boolean(rangeState.error) || !rangeState.indices.length || processing}
                  onClick={() =>
                    void runSplit(
                      rangeState.indices,
                      buildPageFilename(document.baseName, `pages_${rangeState.normalized || "split"}`),
                    )
                  }
                >
                  Split
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: document.pageCount }, (_, index) => {
              const isSelected = activeIndices.includes(index);
              return (
                <PageThumbnail
                  key={index}
                  pdfBytes={document.bytes}
                  pageIndex={index}
                  selected={isSelected}
                  onClick={
                    mode === "select"
                      ? () =>
                          setSelectedPages((current) =>
                            current.includes(index)
                              ? current.filter((page) => page !== index)
                              : [...current, index].sort((a, b) => a - b),
                          )
                      : undefined
                  }
                />
              );
            })}
          </div>
        </>
      ) : null}

      {processing ? <ProcessingSpinner label="Creating split PDF..." /> : null}

      {result ? (
        <div className="card-surface flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <h2 className="font-semibold">Split PDF ready</h2>
            <p className="text-sm text-ink-muted dark:text-slate-300">
              Your selected pages are ready to download.
            </p>
          </div>
          <DownloadButton pdfBytes={result} filename={resultFilename} />
        </div>
      ) : null}
    </div>
  );
}
