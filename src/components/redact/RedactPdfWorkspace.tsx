"use client";

import { PDFDocument, rgb } from "pdf-lib";
import { Download, Eraser, Undo2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import { downloadPDF, formatFileSize, getFriendlyPdfError, loadPdfFile } from "@/lib/utils";
import type { PdfDocumentState } from "@/types/pdf";

type RedactionBox = {
  page: number; // 1-based
  x: number; // PDF-space top-left origin
  y: number; // PDF-space top-left origin
  width: number; // PDF-space
  height: number; // PDF-space
};

type PageSize = { width: number; height: number };

type DragState = {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
} | null;

let pdfJsPromise: Promise<typeof import("pdfjs-dist/legacy/build/pdf.mjs")> | null = null;
const workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url).toString();

async function getPdfJs() {
  if (!pdfJsPromise) {
    pdfJsPromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
      return pdfjs;
    });
  }
  return pdfJsPromise;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function RedactPdfWorkspace() {
  const [document, setDocument] = useState<PdfDocumentState | null>(null);
  const [pdfProxy, setPdfProxy] = useState<null | { getPage: (n: number) => Promise<unknown>; destroy: () => Promise<void> }>(null);
  const [pageSizes, setPageSizes] = useState<Record<number, PageSize>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [boxes, setBoxes] = useState<RedactionBox[]>([]);
  const [drag, setDrag] = useState<DragState>(null);
  const [renderSize, setRenderSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [stageWidth, setStageWidth] = useState(0);
  const [loadingPage, setLoadingPage] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);

  const currentPageBoxes = useMemo(() => boxes.filter((b) => b.page === currentPage), [boxes, currentPage]);

  useEffect(() => {
    let active = true;

    async function preparePdf() {
      if (!document) {
        setPdfProxy(null);
        setPageSizes({});
        return;
      }
      try {
        setError(null);
        const pdfjs = await getPdfJs();
        const pdf = await pdfjs.getDocument({ data: document.bytes.slice(0) }).promise;
        if (!active) {
          await pdf.destroy();
          return;
        }
        const sizes: Record<number, PageSize> = {};
        for (let i = 1; i <= pdf.numPages; i += 1) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1 });
          sizes[i] = { width: viewport.width, height: viewport.height };
          page.cleanup();
        }
        if (!active) {
          await pdf.destroy();
          return;
        }
        setPageSizes(sizes);
        setPdfProxy(pdf as unknown as { getPage: (n: number) => Promise<unknown>; destroy: () => Promise<void> });
      } catch (err) {
        setError(getFriendlyPdfError(err));
      }
    }

    void preparePdf();

    return () => {
      active = false;
    };
  }, [document]);

  useEffect(() => {
    return () => {
      if (pdfProxy) {
        void pdfProxy.destroy();
      }
    };
  }, [pdfProxy]);

  useEffect(() => {
    if (!stageRef.current) return;
    setStageWidth(stageRef.current.clientWidth);
    const observer = new ResizeObserver(() => {
      if (!stageRef.current) return;
      setStageWidth(stageRef.current.clientWidth);
    });
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function renderCurrentPage() {
      if (!pdfProxy || !canvasRef.current || !stageRef.current || !pageSizes[currentPage]) return;
      setLoadingPage(true);
      try {
        const page = (await pdfProxy.getPage(currentPage)) as {
          getViewport: (opts: { scale: number }) => { width: number; height: number };
          render: (opts: {
            canvas: HTMLCanvasElement;
            canvasContext: CanvasRenderingContext2D;
            viewport: { width: number; height: number };
          }) => { promise: Promise<void> };
          cleanup: () => void;
        };
        const base = page.getViewport({ scale: 1 });
        const containerWidth = stageWidth || stageRef.current.clientWidth;
        const targetWidth = Math.max(320, Math.min(base.width, containerWidth));
        const scale = targetWidth / base.width;
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas rendering is not available in this browser.");
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        if (cancelled) return;
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        page.cleanup();
        if (cancelled) return;
        setRenderSize({ width: viewport.width, height: viewport.height });
      } catch (err) {
        if (!cancelled) setError(getFriendlyPdfError(err));
      } finally {
        if (!cancelled) setLoadingPage(false);
      }
    }

    void renderCurrentPage();
    return () => {
      cancelled = true;
    };
  }, [currentPage, pageSizes, pdfProxy, stageWidth]);

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setError(null);
    setBoxes([]);
    setCurrentPage(1);
    setDrag(null);
    try {
      const loaded = await loadPdfFile(file);
      setDocument(loaded);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    }
  }

  function getPointInCanvas(clientX: number, clientY: number) {
    const stage = stageRef.current;
    if (!stage || renderSize.width <= 0 || renderSize.height <= 0) return null;
    const rect = stage.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, renderSize.width);
    const y = clamp(clientY - rect.top, 0, renderSize.height);
    return { x, y };
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!document || loadingPage || processing) return;
    const point = getPointInCanvas(event.clientX, event.clientY);
    if (!point) return;
    pointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ startX: point.x, startY: point.y, currentX: point.x, currentY: point.y });
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag || pointerIdRef.current !== event.pointerId) return;
    const point = getPointInCanvas(event.clientX, event.clientY);
    if (!point) return;
    setDrag((prev) => (prev ? { ...prev, currentX: point.x, currentY: point.y } : prev));
  }

  function commitDragBox() {
    if (!drag || !pageSizes[currentPage] || renderSize.width <= 0 || renderSize.height <= 0) return;
    const minX = Math.min(drag.startX, drag.currentX);
    const minY = Math.min(drag.startY, drag.currentY);
    const width = Math.abs(drag.currentX - drag.startX);
    const height = Math.abs(drag.currentY - drag.startY);
    if (width < 3 || height < 3) return;

    const size = pageSizes[currentPage];
    const scaleX = size.width / renderSize.width;
    const scaleY = size.height / renderSize.height;

    const newBox: RedactionBox = {
      page: currentPage,
      x: minX * scaleX,
      y: minY * scaleY,
      width: width * scaleX,
      height: height * scaleY,
    };
    setBoxes((prev) => [...prev, newBox]);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    pointerIdRef.current = null;
    commitDragBox();
    setDrag(null);
  }

  function onUndoCurrentPage() {
    setBoxes((prev) => {
      for (let i = prev.length - 1; i >= 0; i -= 1) {
        if (prev[i]?.page === currentPage) {
          const next = [...prev];
          next.splice(i, 1);
          return next;
        }
      }
      return prev;
    });
  }

  function onClearCurrentPage() {
    setBoxes((prev) => prev.filter((box) => box.page !== currentPage));
  }

  async function onApplyAndDownload() {
    if (!document) return;
    if (!boxes.length) {
      setError("Draw at least one redaction box before downloading.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const pdfDoc = await PDFDocument.load(document.bytes.slice(0));
      for (const box of boxes) {
        const page = pdfDoc.getPage(box.page - 1);
        const pageHeight = page.getHeight();
        const pdfY = pageHeight - box.y - box.height;
        page.drawRectangle({
          x: box.x,
          y: pdfY,
          width: box.width,
          height: box.height,
          color: rgb(0, 0, 0),
          borderWidth: 0,
        });
      }
      const out = new Uint8Array(await pdfDoc.save());
      downloadPDF(out, `${document.baseName}_redacted.pdf`);
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
          <h1 className="text-3xl font-bold">Redact PDF</h1>
          <p className="max-w-2xl text-ink-muted dark:text-slate-300">
            Black out sensitive content in your PDF directly in your browser. No uploads, no server processing.
          </p>
        </section>
        {error ? (
          <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
        ) : null}
        <FileDropzone multiple={false} onFilesSelected={handleFile} showProBatchHint />
      </div>
    );
  }

  const size = pageSizes[currentPage];
  const previewBox =
    drag && size && renderSize.width > 0 && renderSize.height > 0
      ? {
          left: Math.min(drag.startX, drag.currentX),
          top: Math.min(drag.startY, drag.currentY),
          width: Math.abs(drag.currentX - drag.startX),
          height: Math.abs(drag.currentY - drag.startY),
        }
      : null;

  return (
    <div className="page-wrap animate-fadeIn space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">Redact PDF</h1>
        <p className="text-sm text-ink-muted dark:text-slate-300">
          Your file never leaves your browser. Redactions are permanent and cannot be undone after download.
        </p>
      </section>

      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
      ) : null}

      <div className="grid gap-0 overflow-hidden rounded-xl border border-border bg-white dark:border-gray-700 dark:bg-gray-900 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="bg-gray-50 p-4 dark:bg-[#0b1020] sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              className="secondary-button"
              disabled={currentPage <= 1 || loadingPage}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Page {currentPage} of {document.pageCount}
            </p>
            <button
              type="button"
              className="secondary-button"
              disabled={currentPage >= document.pageCount || loadingPage}
              onClick={() => setCurrentPage((p) => Math.min(document.pageCount, p + 1))}
            >
              Next
            </button>
          </div>

          <div
            ref={stageRef}
            className="relative mx-auto w-full max-w-[960px] cursor-crosshair touch-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <canvas
              ref={canvasRef}
              className="block max-w-full rounded-lg border border-border bg-white shadow-sm"
              style={{ width: renderSize.width || "100%", height: "auto" }}
            />

            {size && renderSize.width > 0 && renderSize.height > 0 ? (
              <div className="pointer-events-none absolute left-0 top-0" style={{ width: renderSize.width, height: renderSize.height }}>
                {currentPageBoxes.map((box, idx) => {
                  const scaleX = renderSize.width / size.width;
                  const scaleY = renderSize.height / size.height;
                  return (
                    <div
                      key={`${box.page}-${idx}`}
                      className="absolute bg-black"
                      style={{
                        left: box.x * scaleX,
                        top: box.y * scaleY,
                        width: box.width * scaleX,
                        height: box.height * scaleY,
                      }}
                    />
                  );
                })}
                {previewBox ? (
                  <div
                    className="absolute border border-black bg-black/45"
                    style={{
                      left: previewBox.left,
                      top: previewBox.top,
                      width: previewBox.width,
                      height: previewBox.height,
                    }}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        </section>

        <aside className="space-y-4 border-t border-border bg-white p-5 dark:border-gray-700 dark:bg-gray-900 lg:border-l lg:border-t-0">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">Redaction tools</div>

          <div className="rounded-lg border border-border bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
            Draw boxes over content to permanently black it out in the downloaded PDF.
          </div>

          <div className="grid gap-3">
            <button
              type="button"
              className="secondary-button w-full gap-2"
              disabled={!currentPageBoxes.length || processing}
              onClick={onUndoCurrentPage}
            >
              <Undo2 className="h-4 w-4" />
              Undo
            </button>
            <button
              type="button"
              className="secondary-button w-full gap-2"
              disabled={!currentPageBoxes.length || processing}
              onClick={onClearCurrentPage}
            >
              <Eraser className="h-4 w-4" />
              Clear Page
            </button>
          </div>

          <div className="rounded-lg border border-border bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
            Current page boxes: <span className="font-semibold">{currentPageBoxes.length}</span>
            <br />
            Total boxes: <span className="font-semibold">{boxes.length}</span>
          </div>

          <button
            type="button"
            className="primary-button w-full gap-2"
            disabled={processing || !boxes.length}
            onClick={() => void onApplyAndDownload()}
          >
            <Download className="h-4 w-4" />
            Apply Redactions & Download
          </button>
        </aside>
      </div>

      {loadingPage ? <ProcessingSpinner label="Rendering page preview..." /> : null}
      {processing ? <ProcessingSpinner label="Applying permanent redactions..." /> : null}

      <div className="rounded-xl border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
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
              setBoxes([]);
              setCurrentPage(1);
              setError(null);
            }}
          >
            Try another file
          </button>
        </div>
      </div>
    </div>
  );
}

