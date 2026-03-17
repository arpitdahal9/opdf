"use client";

import { useEffect, useRef, useState } from "react";
import { PenLine, RotateCcw } from "lucide-react";
import { PDFArray, PDFDocument, PDFName } from "pdf-lib";

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

type PlacementMode = "auto-fields" | "manual-click";

type FieldTarget = {
  id: string;
  fieldName: string;
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

type ClickPlacement = {
  xNorm: number;
  yNorm: number;
};

export function SignPdfWorkspace() {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [placementMode, setPlacementMode] = useState<PlacementMode>("manual-click");
  const [fieldTargets, setFieldTargets] = useState<FieldTarget[]>([]);
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([]);
  const [clickPlacement, setClickPlacement] = useState<ClickPlacement | null>(null);
  const [clickMarker, setClickMarker] = useState<{ x: number; y: number } | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
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
    setFieldTargets([]);
    setSelectedFieldIds([]);
    setClickPlacement(null);
    setClickMarker(null);

    try {
      const bytes = await fileToUint8Array(file);
      const firstPageImage = await renderPdfPageToImage(bytes, 0, { format: "jpeg", scale: 1.2 });
      setPdfBytes(bytes);
      setFileName(file.name);
      setPreviewUrl(firstPageImage);

      // Try to detect signature-like form fields for auto placement.
      try {
        const pdfDoc = await PDFDocument.load(bytes);
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        const pages = pdfDoc.getPages();
        const detected: FieldTarget[] = [];

        fields.forEach((field, fieldIndex) => {
          const name = field.getName();
          const type = (field as any).getType?.() as string | undefined;
          const lower = name.toLowerCase();

          const looksLikeSignature =
            type === "signature" || lower.includes("sign") || lower.includes("signature") || lower.includes("sig");

          if (!looksLikeSignature) return;

          const acroField = (field as any).acroField;
          const widgets = acroField?.getWidgets?.() ?? [];

          widgets.forEach((widget: any, widgetIndex: number) => {
            const rect = widget.getRectangle?.();
            if (!rect) return;

            let pageIndex = 0;
            const ref = widget.ref;

            pages.forEach((page, idx) => {
              const annotsRaw = page.node.lookupMaybe(PDFName.of("Annots"), PDFArray) as PDFArray | undefined;
              const annots = annotsRaw ? annotsRaw.asArray() : [];
              if (annots.includes(ref)) {
                pageIndex = idx;
              }
            });

            detected.push({
              id: `${fieldIndex}-${widgetIndex}`,
              fieldName: name,
              pageIndex,
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            });
          });
        });

        if (detected.length) {
          setFieldTargets(detected);
          setSelectedFieldIds(detected.map((t) => t.id));
          setPlacementMode("auto-fields");
        } else {
          setPlacementMode("manual-click");
        }
      } catch (detectErr) {
        // If form detection fails, gracefully fall back to manual click mode.
        setPlacementMode("manual-click");
      }
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

  const handlePreviewClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!previewContainerRef.current) return;
    const containerRect = previewContainerRef.current.getBoundingClientRect();
    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;

    const xNorm = x / containerRect.width;
    const yNorm = 1 - y / containerRect.height;

    setClickPlacement({ xNorm, yNorm });
    setClickMarker({ x, y });
    // When user manually chooses a spot, switch to manual mode to avoid confusion.
    setPlacementMode("manual-click");
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
      const defaultSigWidth = 120;
      const defaultSigHeight = (sigImage.height / sigImage.width) * defaultSigWidth;
      const margin = 36;

      const pages = pdf.getPages();

      if (placementMode === "auto-fields" && fieldTargets.length && selectedFieldIds.length) {
        // Place signature inside selected form field rectangles.
        fieldTargets
          .filter((t) => selectedFieldIds.includes(t.id))
          .forEach((target) => {
            const page = pages[target.pageIndex] ?? pages[0];
            page.drawImage(sigImage, {
              x: target.x,
              y: target.y,
              width: target.width,
              height: target.height,
            });
          });
      } else if (clickPlacement) {
        // Place signature based on user click – same relative position on every page.
        pages.forEach((page) => {
          const { width, height } = page.getSize();
          const sigWidth = defaultSigWidth;
          const sigHeight = defaultSigHeight;

          const x = clickPlacement.xNorm * width - sigWidth / 2;
          const y = clickPlacement.yNorm * height - sigHeight / 2;

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
        {fieldTargets.length ? (
          <p className="text-xs text-emerald-600 dark:text-emerald-300">
            We detected possible signature fields. You can sign those automatically or switch to manual placement.
          </p>
        ) : (
          <p className="text-xs text-ink-muted dark:text-slate-400">
            No form fields detected. Use the preview on the right to choose where to place your signature.
          </p>
        )}
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
              Use your mouse or touch to sign. Then choose where to place it on the preview (or use detected fields if
              available).
            </p>
          </div>
        </section>

        <section className="glass-panel space-y-4 p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">3. Choose where to sign</h2>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                className={
                  placementMode === "auto-fields" && fieldTargets.length ? "primary-button" : "secondary-button"
                }
                disabled={!fieldTargets.length}
                onClick={() => setPlacementMode("auto-fields")}
              >
                Use form fields
              </button>
              <button
                type="button"
                className={placementMode === "manual-click" ? "primary-button" : "secondary-button"}
                onClick={() => setPlacementMode("manual-click")}
              >
                Click on page
              </button>
            </div>
          </div>

          {placementMode === "auto-fields" && fieldTargets.length ? (
            <div className="space-y-2 rounded-lg border border-border bg-white/80 p-3 text-xs dark:bg-gray-900/60">
              <p className="mb-1 font-medium text-gray-900 dark:text-white">Detected signature fields</p>
              <div className="space-y-1.5">
                {fieldTargets.map((target) => (
                  <label key={target.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                      checked={selectedFieldIds.includes(target.id)}
                      onChange={(event) => {
                        setSelectedFieldIds((current) =>
                          event.target.checked
                            ? [...current, target.id]
                            : current.filter((id) => id !== target.id),
                        );
                      }}
                    />
                    <span className="truncate">
                      <span className="font-semibold">{target.fieldName}</span>{" "}
                      <span className="text-ink-muted dark:text-slate-400">(page {target.pageIndex + 1})</span>
                    </span>
                  </label>
                ))}
              </div>
              {!selectedFieldIds.length ? (
                <p className="mt-1 text-[11px] text-danger">
                  Select at least one field or switch to &ldquo;Click on page&rdquo;.
                </p>
              ) : null}
            </div>
          ) : null}

          <div
            ref={previewContainerRef}
            className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-lg border border-border bg-gray-100 dark:bg-[#0d132a] p-3"
          >
            {previewUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="PDF preview"
                  className="max-h-[220px] w-auto max-w-full rounded-md shadow-sm"
                  onClick={placementMode === "manual-click" ? handlePreviewClick : undefined}
                />
                {placementMode === "manual-click" && clickMarker ? (
                  <div
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded border border-primary bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary shadow-sm"
                    style={{ left: clickMarker.x, top: clickMarker.y }}
                  >
                    Sign here
                  </div>
                ) : null}
              </>
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
              disabled={
                !pdfBytes ||
                !hasSignature ||
                processing ||
                (placementMode === "auto-fields" && !!fieldTargets.length && !selectedFieldIds.length)
              }
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

