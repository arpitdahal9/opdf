"use client";

import { useEffect, useRef, useState } from "react";
import { PenLine, RotateCcw, Trash2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import { renderPdfPageToImage } from "@/lib/pdf/pdfToImage";
import { downloadPDF, fileToUint8Array, getFriendlyPdfError } from "@/lib/utils";

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

export function SignPdfWorkspace() {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
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
      setHasSignature(false);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleFilesSelected = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setProcessing(true);
    setError(null);
    setPreviewUrl(null);
    setPdfBytes(null);

    try {
      const bytes = await fileToUint8Array(file);
      const firstPageImage = await renderPdfPageToImage(bytes, 0, { format: "jpeg", scale: 1.2 });
      setPdfBytes(bytes);
      setFileName(file.name);
      setPreviewUrl(firstPageImage);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setProcessing(false);
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
    setHasSignature(true);
  };

  const stopDrawing = () => {
    drawing.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHasSignature(false);
  };

  const handleSignPdf = async () => {
    if (!pdfBytes || !hasSignature) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setProcessing(true);
    setError(null);

    try {
      const dataUrl = canvas.toDataURL("image/png");
      const sigBytes = dataUrlToUint8Array(dataUrl);

      const pdf = await PDFDocument.load(pdfBytes);
      const sigImage = await pdf.embedPng(sigBytes);
      const sigWidth = 120;
      const sigHeight = (sigImage.height / sigImage.width) * sigWidth;
      const margin = 36;

      const pages = pdf.getPages();
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawImage(sigImage, {
          x: width - sigWidth - margin,
          y: margin,
          width: sigWidth,
          height: sigHeight,
        });
      });

      const signedBytes = await pdf.save();
      const base = fileName?.replace(/\.pdf$/i, "") || "signed";
      downloadPDF(signedBytes, `${base}_signed.pdf`);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-wrap animate-fadeIn space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">Sign PDF</h1>
        <p className="max-w-2xl text-ink-muted dark:text-slate-300">
          Draw your signature and stamp it onto every page of a PDF—fully in your browser.
        </p>
      </section>

      <section className="glass-panel space-y-4 p-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">1. Upload your PDF</h2>
        <FileDropzone
          multiple={false}
          accept="application/pdf"
          onFilesSelected={handleFilesSelected}
          helperText="Drop a PDF here or click to choose one."
        />
        {fileName ? (
          <p className="text-xs text-ink-muted dark:text-slate-300 truncate">
            Selected: <span className="font-medium">{fileName}</span>
          </p>
        ) : null}
      </section>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <section className="glass-panel space-y-4 p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">2. Draw signature</h2>
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
          <div className="rounded-lg border border-dashed border-border bg-white/80 p-3 dark:bg-gray-900/60">
            <canvas
              ref={canvasRef}
              className="h-40 w-full cursor-crosshair touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={stopDrawing}
              onPointerLeave={stopDrawing}
            />
            <p className="mt-2 text-xs text-ink-muted dark:text-slate-300">
              Use your mouse or touch to sign. This signature will be added to every page near the bottom-right corner.
            </p>
          </div>
        </section>

        <section className="glass-panel space-y-4 p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">3. Preview first page</h2>
          <div className="flex min-h-[220px] items-center justify-center overflow-hidden rounded-lg border border-border bg-gray-100 dark:bg-[#0d132a] p-3">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="PDF preview"
                className="max-h-[220px] w-auto max-w-full rounded-md shadow-sm"
              />
            ) : (
              <p className="text-xs text-ink-muted dark:text-slate-300">
                Upload a PDF to see a preview of the first page.
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="primary-button"
              disabled={!pdfBytes || !hasSignature || processing}
              onClick={() => void handleSignPdf()}
            >
              <PenLine className="mr-2 h-4 w-4" />
              Apply signature and download
            </button>
          </div>
        </section>
      </div>

      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {processing ? <ProcessingSpinner label="Applying signature to your PDF..." /> : null}
    </div>
  );
}

