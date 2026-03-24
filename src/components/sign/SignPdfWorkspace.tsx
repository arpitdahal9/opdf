"use client";

import { useEffect, useRef, useState } from "react";
import { PenLine, RotateCcw } from "lucide-react";
import { PDFDocument } from "pdf-lib";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ProcessingResultStats } from "@/components/shared/ProcessingResultStats";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import { getPdfPageCount, renderPdfPageToImage } from "@/lib/pdf/pdfToImage";
import { downloadPDF, fileToUint8Array, formatFileSize, getFriendlyPdfError } from "@/lib/utils";

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

type ClickPlacement = {
  pageIndex: number;
  xNorm: number;
  yNorm: number;
};

type PagePreview = {
  pageIndex: number;
  url: string;
};

type SignatureMode = "draw" | "initials";

function initialsToPngBytes(initials: string): Uint8Array {
  const value = initials.trim().toUpperCase();
  const canvas = document.createElement("canvas");
  canvas.width = 760;
  canvas.height = 280;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas rendering is not available in this browser.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Script-style font stack approximates Adobe sign/initials style.
  ctx.font = "116px 'Segoe Script', 'Lucida Handwriting', 'Brush Script MT', cursive";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000000";
  ctx.fillText(value, canvas.width / 2, canvas.height / 2 + 8);
  return dataUrlToUint8Array(canvas.toDataURL("image/png"));
}

export function SignPdfWorkspace() {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pagePreviews, setPagePreviews] = useState<PagePreview[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [signProcessing, setSignProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [signatureMode, setSignatureMode] = useState<SignatureMode>("initials");
  const [initials, setInitials] = useState("");
  const [placements, setPlacements] = useState<ClickPlacement[]>([]);
  const [pdfPageCount, setPdfPageCount] = useState<number | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [signStats, setSignStats] = useState<{
    beforeSize: number;
    afterSize: number;
    pageCount: number;
    processingTimeMs: number;
    reductionPercent: number | null;
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(ratio, ratio);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, rect.width, rect.height);
      }
      setHasDrawnSignature(false);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleFilesSelected = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setPreviewLoading(true);
    setError(null);
    setSignStats(null);
    setPdfPageCount(null);
    setOriginalSize(null);
    setPagePreviews([]);
    setPdfBytes(null);
    setPlacements([]);

    try {
      const bytes = await fileToUint8Array(file);
      setPdfBytes(bytes);
      setFileName(file.name);
      setOriginalSize(file.size);
      // Generate thumbnails for all pages so users can click exactly where they want to sign.
      const pageCount = await getPdfPageCount(bytes);
      setPdfPageCount(pageCount);
      const previews: PagePreview[] = [];
      for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
        // Use a slightly lower scale for faster, smaller thumbnails.
        // eslint-disable-next-line no-await-in-loop
        const url = await renderPdfPageToImage(bytes, pageIndex, { format: "jpeg", scale: 1.2 });
        previews.push({ pageIndex, url });
      }
      setPagePreviews(previews);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setPreviewLoading(false);
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    ctx.beginPath();
    ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";
    ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
    ctx.stroke();
    setHasDrawnSignature(true);
  };

  const stopDrawing = () => {
    drawing.current = false;
  };

  const clearSignature = () => {
    if (signatureMode === "initials") {
      setInitials("");
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHasDrawnSignature(false);
  };

  const handleThumbnailClick = (event: React.MouseEvent<HTMLButtonElement>, pageIndex: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const xNorm = x / rect.width;
    const yNorm = 1 - y / rect.height;

    setPlacements((current) => [...current, { pageIndex, xNorm, yNorm }]);
  };

  const handleSignPdf = async () => {
    if (!pdfBytes) return;
    if (signatureMode === "draw" && !hasDrawnSignature) return;
    if (signatureMode === "initials" && !initials.trim()) return;

    setSignProcessing(true);
    setError(null);
    setSignStats(null);
    const beforeSize = originalSize ?? pdfBytes.byteLength;
    const startMs = performance.now();

    try {
      const sigBytes =
        signatureMode === "draw"
          ? (() => {
              const canvas = canvasRef.current;
              if (!canvas) throw new Error("Signature canvas is unavailable.");
              return dataUrlToUint8Array(canvas.toDataURL("image/png"));
            })()
          : initialsToPngBytes(initials);

      const pdf = await PDFDocument.load(pdfBytes);
      const sigImage = await pdf.embedPng(sigBytes);
      const defaultSigWidth = 120;
      const defaultSigHeight = (sigImage.height / sigImage.width) * defaultSigWidth;
      const margin = 36;

      const pages = pdf.getPages();

      if (placements.length) {
        // Place signatures exactly where the user clicked on specific pages.
        placements.forEach(({ pageIndex, xNorm, yNorm }) => {
          const page = pages[pageIndex] ?? pages[0];
          const { width, height } = page.getSize();
          const sigWidth = defaultSigWidth;
          const sigHeight = defaultSigHeight;

          const x = xNorm * width - sigWidth / 2;
          const y = yNorm * height - sigHeight / 2;

          page.drawImage(sigImage, {
            x,
            y,
            width: sigWidth,
            height: sigHeight,
          });
        });
      } else {
        // Fallback: original behavior – bottom-right of every page.
        pages.forEach((page) => {
          const { width } = page.getSize();
          page.drawImage(sigImage, {
            x: width - defaultSigWidth - margin,
            y: margin,
            width: defaultSigWidth,
            height: defaultSigHeight,
          });
        });
      }

      const signedBytes = await pdf.save();
      const afterSize = signedBytes.byteLength;
      const pageCount = pdf.getPageCount();
      const reductionPercent =
        afterSize < beforeSize ? Math.round(((beforeSize - afterSize) / beforeSize) * 100) : null;

      setSignStats({
        beforeSize,
        afterSize,
        pageCount,
        processingTimeMs: performance.now() - startMs,
        reductionPercent,
      });
      const base = fileName?.replace(/\.pdf$/i, "") || "signed";
      downloadPDF(signedBytes, `${base}_signed.pdf`);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setSignProcessing(false);
    }
  };

  return (
    <div className="page-wrap animate-fadeIn space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">Sign PDF</h1>
        <p className="max-w-2xl text-ink-muted dark:text-slate-300">
          Draw your signature and place it on any pages of a PDF—fully in your browser.
        </p>
      </section>

      {!pdfBytes ? (
        <section className="glass-panel space-y-4 p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">1. Upload your PDF</h2>
          <FileDropzone
            multiple={false}
            accept="application/pdf"
            onFilesSelected={handleFilesSelected}
            helperText="Drop a PDF here or click to choose one."
            showProBatchHint
          />
          <p className="text-xs text-ink-muted dark:text-slate-400">
            After uploading, you will place signatures on page thumbnails, then create your signature in Step 2.
          </p>
        </section>
      ) : (
        <>
          <section className="glass-panel space-y-4 p-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">1. Choose where to sign</h2>
              </div>
              {fileName ? (
                <p className="text-xs text-ink-muted dark:text-slate-300 truncate">
                  <span className="font-medium">{fileName}</span>
                  {originalSize != null && pdfPageCount != null ? (
                    <> · {formatFileSize(originalSize)} · {pdfPageCount} page{pdfPageCount === 1 ? "" : "s"}</>
                  ) : null}
                </p>
              ) : null}
              <p className="text-xs text-ink-muted dark:text-slate-300">
                Click on any page thumbnail below to add your signature. You can click multiple pages, and each click
                adds another signature.
              </p>
            </div>

            <div className="max-h-[760px] overflow-auto rounded-lg border border-border bg-gray-100 p-3 dark:bg-[#0d132a]">
              {pagePreviews.length ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {pagePreviews.map((preview) => {
                    const pagePlacements = placements.filter((p) => p.pageIndex === preview.pageIndex);
                    return (
                      <button
                        key={preview.pageIndex}
                        type="button"
                        className="group relative flex flex-col items-center overflow-hidden rounded-md border border-border bg-white p-2 text-xs shadow-sm dark:bg-gray-900"
                        onClick={(event) => handleThumbnailClick(event, preview.pageIndex)}
                      >
                        <div className="relative w-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview.url}
                            alt={`Page ${preview.pageIndex + 1}`}
                            className="max-h-[420px] w-full rounded-sm object-contain"
                          />
                          {pagePlacements.map((placement, index) => (
                            <div
                              // eslint-disable-next-line react/no-array-index-key
                              key={index}
                              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded border border-primary bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary shadow-sm"
                              style={{
                                left: `${placement.xNorm * 100}%`,
                                top: `${(1 - placement.yNorm) * 100}%`,
                              }}
                            >
                              Sign
                            </div>
                          ))}
                        </div>
                        <span className="mt-1 text-ink-muted dark:text-slate-300">Page {preview.pageIndex + 1}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-ink-muted dark:text-slate-300">
                  Generating page thumbnails...
                </p>
              )}
            </div>
            <div className="flex justify-start">
              {placements.length ? (
                <button
                  type="button"
                  className="secondary-button min-h-8 px-3 text-xs"
                  onClick={() => setPlacements([])}
                >
                  Clear placements
                </button>
              ) : null}
            </div>
          </section>

          <section className="glass-panel space-y-4 p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">2. Create signature</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="secondary-button min-h-9 px-3"
                  onClick={clearSignature}
                >
                  <RotateCcw className="mr-1 h-4 w-4" />
                  Clear
                </button>
              </div>
            </div>
            <fieldset className="space-y-2">
              <legend className="text-xs font-semibold text-gray-600 dark:text-gray-400">Signature style</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <label
                  className={
                    signatureMode === "draw"
                      ? "cursor-pointer rounded-lg border-2 border-primary bg-primary/5 p-3"
                      : "cursor-pointer rounded-lg border border-border bg-white p-3 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                  }
                >
                  <input
                    type="radio"
                    name="signature-style"
                    className="sr-only"
                    checked={signatureMode === "draw"}
                    onChange={() => setSignatureMode("draw")}
                  />
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Draw</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Use mouse/touch to draw your full signature.</p>
                </label>
                <label
                  className={
                    signatureMode === "initials"
                      ? "cursor-pointer rounded-lg border-2 border-primary bg-primary/5 p-3"
                      : "cursor-pointer rounded-lg border border-border bg-white p-3 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                  }
                >
                  <input
                    type="radio"
                    name="signature-style"
                    className="sr-only"
                    checked={signatureMode === "initials"}
                    onChange={() => setSignatureMode("initials")}
                  />
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Initials</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Type initials and stamp with script style.</p>
                </label>
              </div>
            </fieldset>
            <div className="rounded-lg border border-dashed border-border bg-white/80 p-3 dark:bg-gray-900/60">
              {signatureMode === "draw" ? (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Draw signature</h3>
                  <canvas
                    ref={canvasRef}
                    className="h-56 w-full cursor-crosshair touch-none"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={stopDrawing}
                    onPointerLeave={stopDrawing}
                  />
                  <p className="mt-2 text-xs text-ink-muted dark:text-slate-300">
                    Use your mouse or touch to sign. Then click on the page thumbnails to choose where to place it.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Initials stamp</h3>
                  <label className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <span>Type initials</span>
                    <input
                      type="text"
                      maxLength={25}
                      value={initials}
                      onChange={(event) => setInitials(event.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 25))}
                      placeholder="e.g. AD"
                      className="field-input"
                    />
                  </label>
                  <div className="rounded-md border border-border bg-white p-3 dark:bg-gray-950/40">
                    <p
                      className="min-h-16 text-center text-5xl text-black"
                      style={{ fontFamily: "'Segoe Script', 'Lucida Handwriting', 'Brush Script MT', cursive" }}
                    >
                      {initials.trim().toUpperCase() || "AB"}
                    </p>
                  </div>
                  <p className="text-xs text-ink-muted dark:text-slate-300">
                    Initials are stamped using a script signature style similar to Adobe.
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="primary-button"
                disabled={
                  !pdfBytes ||
                  signProcessing ||
                  (signatureMode === "draw" ? !hasDrawnSignature : !initials.trim())
                }
                onClick={() => void handleSignPdf()}
              >
                <PenLine className="mr-2 h-4 w-4" />
                Apply signature and download
              </button>
            </div>
            <p className="text-xs text-ink-muted dark:text-slate-400">
              To sign a different PDF, refresh this page and upload a new file.
            </p>
          </section>
        </>
      )}

      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {signStats ? (
        <ProcessingResultStats
          beforeSize={signStats.beforeSize}
          afterSize={signStats.afterSize}
          afterLabel="Signed"
          pageCount={signStats.pageCount}
          processingTimeMs={signStats.processingTimeMs}
          reductionPercent={signStats.reductionPercent}
        />
      ) : null}

      {previewLoading ? (
        <ProcessingSpinner label="Loading your PDF and generating previews..." />
      ) : null}

      {signProcessing ? <ProcessingSpinner label="Applying signature to your PDF..." /> : null}
    </div>
  );
}

