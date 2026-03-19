"use client";

import JSZip from "jszip";
import { Download, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { PageThumbnail } from "@/components/shared/PageThumbnail";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import { splitPDF } from "@/lib/pdf/split";
import { buildPageFilename, downloadBlob, downloadPDF, formatFileSize, getFriendlyPdfError, loadPdfFile, randomUUID } from "@/lib/utils";
import type { PdfDocumentState } from "@/types/pdf";

type SplitTab = "range" | "pages";
type SplitMode = "custom" | "fixed";
type ExtractMode = "all" | "select";

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
      <div className="text-center text-xs font-medium text-gray-600 dark:text-gray-400">{label}</div>
      <div className="rounded-lg border border-dashed border-gray-300 bg-white/60 p-4 dark:border-gray-700 dark:bg-gray-900/40">
        <div className="mx-auto flex max-w-[520px] items-start justify-center gap-6">
          <div className="w-[170px]">
            <PageThumbnail pdfBytes={pdfBytes} pageIndex={firstIndex} compact width={170} />
            <div className="mt-1 text-center text-[11px] text-gray-500 dark:text-gray-400">
              {range.from}
            </div>
          </div>
          {showDots ? (
            <div className="flex h-[240px] w-10 items-center justify-center text-2xl text-gray-400">
              …
            </div>
          ) : null}
          {count > 1 ? (
            <div className="w-[170px]">
              <PageThumbnail pdfBytes={pdfBytes} pageIndex={lastIndex} compact width={170} />
              <div className="mt-1 text-center text-[11px] text-gray-500 dark:text-gray-400">
                {range.to}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function SplitRangeWorkspace() {
  const [document, setDocument] = useState<PdfDocumentState | null>(null);
  const [tab, setTab] = useState<SplitTab>("range");
  const [mode, setMode] = useState<SplitMode>("custom");
  const [customRanges, setCustomRanges] = useState<PageRange[]>([]);
  const [mergeAll, setMergeAll] = useState(false);
  const [fixedSize, setFixedSize] = useState<number>(4);
  const [extractMode, setExtractMode] = useState<ExtractMode>("all");
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = document?.pageCount ?? 0;

  useEffect(() => {
    if (!document) return;
    setCustomRanges([makeDefaultRange(document.pageCount)]);
    setSelectedPages(new Set());
    setExtractMode("all");
    setTab("range");
  }, [document]);

  const ranges = useMemo(() => {
    if (!document) return [];
    if (mode === "fixed") return computeFixedRanges(document.pageCount, fixedSize);
    return customRanges.map((r) => normalizeRange(r, document.pageCount));
  }, [customRanges, document, fixedSize, mode]);

  const selectedPageIndices = useMemo(() => {
    if (!document) return [];
    return Array.from(selectedPages)
      .filter((p) => p >= 0 && p < document.pageCount)
      .sort((a, b) => a - b);
  }, [document, selectedPages]);

  const pagesSummary = useMemo(() => {
    if (!document) return null;
    if (extractMode === "all") {
      return `All ${document.pageCount} pages will be extracted as separate PDF files.`;
    }
    const count = selectedPageIndices.length;
    if (!count) return "Select pages to extract.";
    return `${count} page${count === 1 ? "" : "s"} selected. ${count} PDF${count === 1 ? "" : "s"} will be created.`;
  }, [document, extractMode, selectedPageIndices.length]);

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
      if (tab === "pages") {
        const indices = extractMode === "all" ? Array.from({ length: document.pageCount }, (_, i) => i) : selectedPageIndices;
        if (!indices.length) throw new Error("Select at least one page.");

        if (indices.length === 1) {
          const out = await splitPDF(document.bytes, [indices[0]!]);
          downloadPDF(out, buildPageFilename(document.baseName, `page_${indices[0]! + 1}`));
          return;
        }

        const zip = new JSZip();
        await Promise.all(
          indices.map(async (pageIndex) => {
            const out = await splitPDF(document.bytes, [pageIndex]);
            const name = buildPageFilename(document.baseName, `page_${pageIndex + 1}`);
            zip.file(name, out);
          }),
        );
        const blob = await zip.generateAsync({ type: "blob" });
        downloadBlob(blob, `${document.baseName || "split"}_pages.zip`);
        return;
      }

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
    <div className="page-wrap animate-fadeIn space-y-5">
      <section className="space-y-1">
        <h1 className="text-3xl font-bold">Split</h1>
      </section>

      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <div className="grid gap-0 overflow-hidden rounded-xl border border-border bg-white dark:border-gray-700 dark:bg-gray-900 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Preview canvas (wide light area) */}
        <section className="bg-gray-50 p-6 dark:bg-[#0b1020]">
          {tab === "range" ? (
            <div className="space-y-8">
              {ranges.map((r, idx) => (
                <RangePreview key={r.id} pdfBytes={document.bytes} range={r} label={`Range ${idx + 1}`} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Select pages</p>
                {extractMode === "select" ? (
                  <button
                    type="button"
                    className="text-xs font-medium text-gray-700 hover:underline dark:text-gray-300"
                    onClick={() => setSelectedPages(new Set())}
                  >
                    Clear
                  </button>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
                {Array.from({ length: document.pageCount }, (_, pageIndex) => (
                  <PageThumbnail
                    key={pageIndex}
                    pdfBytes={document.bytes}
                    pageIndex={pageIndex}
                    width={170}
                    compact
                    selected={selectedPages.has(pageIndex)}
                    onClick={
                      extractMode === "select"
                        ? () =>
                            setSelectedPages((cur) => {
                              const next = new Set(cur);
                              if (next.has(pageIndex)) next.delete(pageIndex);
                              else next.add(pageIndex);
                              return next;
                            })
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right sidebar */}
        <aside className="border-t border-border bg-white p-5 dark:border-gray-700 dark:bg-gray-900 lg:border-l lg:border-t-0 space-y-5">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">Split</div>
          </div>

          <div className="space-y-3">
            <div className="flex rounded-lg border border-border bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
              <button
                type="button"
                className={
                  tab === "range"
                    ? "flex-1 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white"
                    : "flex-1 rounded-md px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                }
                onClick={() => setTab("range")}
              >
                Range
              </button>
              <button
                type="button"
                className={
                  tab === "pages"
                    ? "flex-1 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white"
                    : "flex-1 rounded-md px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                }
                onClick={() => setTab("pages")}
              >
                Pages
              </button>
            </div>
          </div>

          {tab === "pages" ? (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Extract mode:</p>
              <div className="flex rounded-lg border border-border bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
                <button
                  type="button"
                  className={
                    extractMode === "all"
                      ? "flex-1 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white"
                      : "flex-1 rounded-md px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  }
                  onClick={() => {
                    setExtractMode("all");
                    setSelectedPages(new Set());
                  }}
                >
                  Extract all pages
                </button>
                <button
                  type="button"
                  className={
                    extractMode === "select"
                      ? "flex-1 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white"
                      : "flex-1 rounded-md px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  }
                  onClick={() => setExtractMode("select")}
                >
                  Select pages
                </button>
              </div>
              {pagesSummary ? (
                <div className="rounded-lg border border-border bg-blue-50 px-3 py-2 text-xs text-blue-800 dark:border-gray-700 dark:bg-blue-500/10 dark:text-blue-200">
                  {pagesSummary}
                </div>
              ) : null}
              {extractMode === "select" ? (
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Click thumbnails on the left to select pages.
                </div>
              ) : null}
            </div>
          ) : null}

          {tab === "range" ? (
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Range mode:</p>
                <div className="flex rounded-lg border border-border bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
                  <button
                    type="button"
                    className={
                      mode === "custom"
                        ? "flex-1 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white"
                        : "flex-1 rounded-md px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    }
                    onClick={() => setMode("custom")}
                  >
                    Custom
                  </button>
                  <button
                    type="button"
                    className={
                      mode === "fixed"
                        ? "flex-1 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white"
                        : "flex-1 rounded-md px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    }
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
            </div>
          ) : null}

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

      <div className="rounded-xl border border-border bg-white p-4 dark:bg-gray-900 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">{document.name}</span>{" "}
            <span className="text-gray-500 dark:text-gray-400">
              | {formatFileSize(document.size)} | {document.pageCount} page{document.pageCount === 1 ? "" : "s"}
            </span>
          </p>
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
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-5 dark:bg-gray-900 dark:border-gray-700">
        <FileDropzone
          multiple={false}
          onFilesSelected={handleFile}
          helperText="Choose another PDF to split."
          showProBatchHint
        />
      </div>
    </div>
  );
}

