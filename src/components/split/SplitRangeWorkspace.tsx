"use client";

import JSZip from "jszip";
import { Plus, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { PageThumbnail } from "@/components/shared/PageThumbnail";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import { splitPDF } from "@/lib/pdf/split";
import { buildPageFilename, downloadBlob, downloadPDF, formatFileSize, getFriendlyPdfError, loadPdfFile, randomUUID } from "@/lib/utils";
import type { PdfDocumentState } from "@/types/pdf";

type SplitMode = "custom" | "fixed";

type PageRange = {
  id: string;
  from: number; // 1-based
  to: number; // 1-based
};

function clampInt(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.trunc(value)));
}

function normalizeRange(range: PageRange, totalPages: number): PageRange {
  const from = clampInt(range.from, 1, totalPages);
  const to = clampInt(range.to, 1, totalPages);
  if (from <= to) return { ...range, from, to };
  return { ...range, from: to, to: from };
}

function makeDefaultRange(totalPages: number): PageRange {
  return { id: randomUUID(), from: 1, to: Math.max(1, totalPages) };
}

function makeNextRange(prev: PageRange | undefined, totalPages: number): PageRange {
  if (!prev) return { id: randomUUID(), from: 1, to: Math.min(1, totalPages) };
  const start = clampInt(prev.to + 1, 1, totalPages);
  return { id: randomUUID(), from: start, to: Math.min(start, totalPages) };
}

function computeFixedRanges(totalPages: number, chunkSize: number): PageRange[] {
  const size = Math.max(1, Math.trunc(chunkSize));
  const out: PageRange[] = [];
  for (let start = 1; start <= totalPages; start += size) {
    out.push({ id: randomUUID(), from: start, to: Math.min(totalPages, start + size - 1) });
  }
  return out.length ? out : [makeDefaultRange(totalPages)];
}

function buildPageIndices(range: PageRange): number[] {
  const out: number[] = [];
  for (let p = range.from; p <= range.to; p += 1) out.push(p - 1);
  return out;
}

function RangePreview({
  pdfBytes,
  range,
  label,
}: {
  pdfBytes: Uint8Array;
  range: PageRange;
  label: string;
}) {
  const count = range.to - range.from + 1;
  const showDots = count > 2;
  const firstIndex = range.from - 1;
  const lastIndex = range.to - 1;

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</div>
      <div className="flex items-start gap-4">
        <div className="w-[160px]">
          <PageThumbnail pdfBytes={pdfBytes} pageIndex={firstIndex} compact width={160} />
          <div className="mt-1 text-center text-[11px] text-gray-500 dark:text-gray-400">
            {range.from}
          </div>
        </div>
        {showDots ? (
          <div className="flex h-[220px] w-10 items-center justify-center text-2xl text-gray-400">
            …
          </div>
        ) : null}
        {count > 1 ? (
          <div className="w-[160px]">
            <PageThumbnail pdfBytes={pdfBytes} pageIndex={lastIndex} compact width={160} />
            <div className="mt-1 text-center text-[11px] text-gray-500 dark:text-gray-400">
              {range.to}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function SplitRangeWorkspace() {
  const [document, setDocument] = useState<PdfDocumentState | null>(null);
  const [mode, setMode] = useState<SplitMode>("custom");
  const [customRanges, setCustomRanges] = useState<PageRange[]>([]);
  const [mergeAll, setMergeAll] = useState(false);
  const [fixedSize, setFixedSize] = useState<number>(4);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = document?.pageCount ?? 0;

  useEffect(() => {
    if (!document) return;
    setCustomRanges([makeDefaultRange(document.pageCount)]);
  }, [document]);

  const ranges = useMemo(() => {
    if (!document) return [];
    if (mode === "fixed") return computeFixedRanges(document.pageCount, fixedSize);
    return customRanges.map((r) => normalizeRange(r, document.pageCount));
  }, [customRanges, document, fixedSize, mode]);

  const fixedSummary = useMemo(() => {
    if (!document) return null;
    const size = Math.max(1, Math.trunc(fixedSize));
    const count = Math.ceil(document.pageCount / size);
    return `This PDF will be split into files of ${size} page${size === 1 ? "" : "s"}. ${count} PDF${count === 1 ? "" : "s"} will be created.`;
  }, [document, fixedSize]);

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setError(null);
    setDocument(null);
    setProcessing(false);
    try {
      const doc = await loadPdfFile(file);
      setDocument(doc);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    }
  }

  async function handleDownload() {
    if (!document) return;
    setProcessing(true);
    setError(null);
    try {
      const normalized = ranges.filter((r) => r.from >= 1 && r.to <= document.pageCount && r.from <= r.to);
      if (!normalized.length) {
        throw new Error("Add at least one valid page range.");
      }

      if (mergeAll) {
        const mergedIndices = normalized.flatMap((r) => buildPageIndices(r));
        const out = await splitPDF(document.bytes, mergedIndices);
        downloadPDF(out, buildPageFilename(document.baseName, "ranges"));
        return;
      }

      if (normalized.length === 1) {
        const out = await splitPDF(document.bytes, buildPageIndices(normalized[0]!));
        const r = normalized[0]!;
        downloadPDF(out, buildPageFilename(document.baseName, `pages_${r.from}-${r.to}`));
        return;
      }

      const zip = new JSZip();
      await Promise.all(
        normalized.map(async (r, idx) => {
          const out = await splitPDF(document.bytes, buildPageIndices(r));
          const name = buildPageFilename(document.baseName, `range_${idx + 1}_${r.from}-${r.to}`);
          zip.file(name, out);
        }),
      );
      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, `${document.baseName || "split"}_ranges.zip`);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setProcessing(false);
    }
  }

  if (!document) {
    return (
      <div className="page-wrap animate-fadeIn space-y-8">
        <section className="space-y-3">
          <h1 className="text-3xl font-bold">Split PDF</h1>
          <p className="max-w-2xl text-ink-muted dark:text-slate-300">
            Split a PDF by page ranges. Define custom ranges or split into fixed-size chunks — all in your browser.
          </p>
        </section>

        {error ? (
          <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        ) : null}

        <FileDropzone multiple={false} onFilesSelected={handleFile} showProBatchHint />
      </div>
    );
  }

  return (
    <div className="page-wrap animate-fadeIn space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Split</h1>
          <p className="text-sm text-gray-600 dark:text-slate-300">
            {document.name} · {formatFileSize(document.size)} · {document.pageCount} page{document.pageCount === 1 ? "" : "s"}
          </p>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            setDocument(null);
            setCustomRanges([]);
            setError(null);
          }}
        >
          Try another file
        </button>
      </section>

      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Preview */}
        <section className="rounded-xl border border-border bg-white p-5 dark:bg-gray-900 dark:border-gray-700">
          <div className="space-y-6">
            {ranges.map((r, idx) => (
              <RangePreview
                key={r.id}
                pdfBytes={document.bytes}
                range={r}
                label={`Range ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="rounded-xl border border-border bg-white p-5 dark:bg-gray-900 dark:border-gray-700 space-y-5">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Range</h2>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Range mode:</p>
            <div className="flex rounded-lg border border-border bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
              <button
                type="button"
                className={mode === "custom" ? "primary-button flex-1 !min-h-9" : "secondary-button flex-1 !min-h-9"}
                onClick={() => setMode("custom")}
              >
                Custom
              </button>
              <button
                type="button"
                className={mode === "fixed" ? "primary-button flex-1 !min-h-9" : "secondary-button flex-1 !min-h-9"}
                onClick={() => setMode("fixed")}
              >
                Fixed
              </button>
            </div>
          </div>

          {mode === "custom" ? (
            <div className="space-y-4">
              {customRanges.map((r, idx) => (
                <div key={r.id} className="rounded-lg border border-border p-3 dark:border-gray-700 space-y-3">
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Range {idx + 1}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <span>from page</span>
                      <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={r.from}
                        onChange={(e) =>
                          setCustomRanges((cur) =>
                            cur.map((x) => (x.id === r.id ? { ...x, from: Number(e.target.value) } : x)),
                          )
                        }
                        className="field-input"
                      />
                    </label>
                    <label className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <span>to</span>
                      <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={r.to}
                        onChange={(e) =>
                          setCustomRanges((cur) =>
                            cur.map((x) => (x.id === r.id ? { ...x, to: Number(e.target.value) } : x)),
                          )
                        }
                        className="field-input"
                      />
                    </label>
                  </div>
                  {customRanges.length > 1 ? (
                    <button
                      type="button"
                      className="text-xs text-danger hover:underline"
                      onClick={() => setCustomRanges((cur) => cur.filter((x) => x.id !== r.id))}
                    >
                      Remove range
                    </button>
                  ) : null}
                </div>
              ))}

              <button
                type="button"
                className="secondary-button w-full gap-2"
                onClick={() =>
                  setCustomRanges((cur) => [...cur, makeNextRange(cur.at(-1), totalPages)])
                }
              >
                <Plus className="h-4 w-4" />
                Add Range
              </button>

              <label className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={mergeAll}
                  onChange={(e) => setMergeAll(e.target.checked)}
                  className="mt-1"
                />
                <span>Merge all ranges in one PDF file</span>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <span>Split into page ranges of:</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages || 9999}
                  value={fixedSize}
                  onChange={(e) => setFixedSize(Number(e.target.value))}
                  className="field-input"
                />
              </label>
              {fixedSummary ? (
                <div className="rounded-lg border border-border bg-blue-50 px-3 py-2 text-xs text-blue-800 dark:border-gray-700 dark:bg-blue-500/10 dark:text-blue-200">
                  {fixedSummary}
                </div>
              ) : null}
              <label className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={mergeAll}
                  onChange={(e) => setMergeAll(e.target.checked)}
                  className="mt-1"
                />
                <span>Merge all ranges in one PDF file</span>
              </label>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              className="primary-button w-full gap-2"
              disabled={processing}
              onClick={() => void handleDownload()}
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </aside>
      </div>

      {processing ? <ProcessingSpinner label="Splitting your PDF..." /> : null}

      <FileDropzone multiple={false} onFilesSelected={handleFile} helperText="Choose another PDF to split." showProBatchHint />
    </div>
  );
}

