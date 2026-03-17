"use client";

import { RotateCcw, RotateCw } from "lucide-react";
import { useMemo, useState } from "react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { PageThumbnail } from "@/components/shared/PageThumbnail";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import { rotatePDF } from "@/lib/pdf/rotate";
import { buildPageFilename, downloadPDF, getFriendlyPdfError, loadPdfFile } from "@/lib/utils";
import type { PdfDocumentState } from "@/types/pdf";

function normalizeRotation(value: number) {
  return ((value % 360) + 360) % 360;
}

export function RotateWorkspace() {
  const [document, setDocument] = useState<PdfDocumentState | null>(null);
  const [rotations, setRotations] = useState<Map<number, number>>(new Map());
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasChanges = rotations.size > 0;

  const rotationSummary = useMemo(
    () => Array.from(rotations.entries()).reduce((total, [, value]) => total + value, 0),
    [rotations],
  );

  const updateRotation = (pageIndex: number, delta: number) => {
    setRotations((current) => {
      const next = new Map(current);
      const value = normalizeRotation((next.get(pageIndex) ?? 0) + delta);
      if (value === 0) {
        next.delete(pageIndex);
      } else {
        next.set(pageIndex, value);
      }
      return next;
    });
  };

  const rotateAll = (delta: number) => {
    if (!document) return;
    setRotations((current) => {
      const next = new Map<number, number>();
      for (let index = 0; index < document.pageCount; index += 1) {
        const value = normalizeRotation((current.get(index) ?? 0) + delta);
        if (value !== 0) {
          next.set(index, value);
        }
      }
      return next;
    });
  };

  const handleFile = async (files: File[]) => {
    try {
      const nextDocument = await loadPdfFile(files[0]);
      setDocument(nextDocument);
      setRotations(new Map());
      setError(null);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    }
  };

  const applyRotations = async () => {
    if (!document || !hasChanges) {
      return;
    }

    setProcessing(true);
    setError(null);
    try {
      const output = await rotatePDF(document.bytes, rotations);
      downloadPDF(output, buildPageFilename(document.baseName, "rotated"));
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-wrap animate-fadeIn space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">Rotate PDF Pages</h1>
        <p className="max-w-2xl text-ink-muted dark:text-slate-300">
          Rotate any page left or right with an instant preview, or apply the same turn to the entire document.
        </p>
        <p className="text-sm text-ink-muted dark:text-slate-400">
          All in one: rotate individual pages or the whole document in one go.
        </p>
      </section>

      {!document ? (
        <FileDropzone multiple={false} onFilesSelected={handleFile} />
      ) : (
        <div className="card-surface flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="font-semibold">{document.name}</p>
            <p className="text-sm text-ink-muted dark:text-slate-300">
              {document.pageCount} pages loaded. Rotation delta total: {rotationSummary}°.
            </p>
          </div>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setDocument(null);
              setRotations(new Map());
              setError(null);
            }}
          >
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
          <div className="card-surface flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <h2 className="font-semibold">Bulk actions</h2>
              <p className="text-sm text-ink-muted dark:text-slate-300">
                Apply a uniform rotation across the entire file or reset all changes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="secondary-button" onClick={() => rotateAll(-90)}>
                Rotate All Left
              </button>
              <button type="button" className="secondary-button" onClick={() => rotateAll(90)}>
                Rotate All Right
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setRotations(new Map());
                }}
                disabled={!hasChanges}
              >
                Reset All
              </button>
              <button
                type="button"
                className="primary-button"
                disabled={!hasChanges || processing}
                onClick={() => void applyRotations()}
              >
                Apply & Download
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: document.pageCount }, (_, index) => {
              const rotation = rotations.get(index) ?? 0;
              return (
                <PageThumbnail
                  key={index}
                  pdfBytes={document.bytes}
                  pageIndex={index}
                  rotation={rotation}
                  badge={rotation ? `${rotation}°` : undefined}
                >
                  <button
                    type="button"
                    className="secondary-button min-h-10 px-3"
                    onClick={() => updateRotation(index, -90)}
                    aria-label={`Rotate page ${index + 1} left`}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="secondary-button min-h-10 px-3"
                    onClick={() => updateRotation(index, 90)}
                    aria-label={`Rotate page ${index + 1} right`}
                  >
                    <RotateCw className="h-4 w-4" />
                  </button>
                </PageThumbnail>
              );
            })}
          </div>
        </>
      ) : null}

      {processing ? <ProcessingSpinner label="Applying page rotations..." /> : null}
    </div>
  );
}
