"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Move } from "lucide-react";
import { useMemo, useState } from "react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { PageThumbnail } from "@/components/shared/PageThumbnail";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import { reorderPDF } from "@/lib/pdf/reorder";
import { buildPageFilename, downloadPDF, getFriendlyPdfError, loadPdfFile } from "@/lib/utils";
import type { PdfDocumentState } from "@/types/pdf";

function SortablePage({
  pageIndex,
  position,
  pdfBytes,
}: {
  pageIndex: number;
  position: number;
  pdfBytes: Uint8Array;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: pageIndex,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-50" : undefined}
    >
      <PageThumbnail
        pdfBytes={pdfBytes}
        pageIndex={pageIndex}
        label={`Position ${position}`}
        className="touch-none"
      >
        <button
          type="button"
          className="secondary-button min-h-10 px-3"
          aria-label={`Move page ${position}`}
          {...attributes}
          {...listeners}
        >
          <Move className="h-4 w-4" />
        </button>
      </PageThumbnail>
    </div>
  );
}

export function ReorderWorkspace() {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const [document, setDocument] = useState<PdfDocumentState | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [activePage, setActivePage] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasChanges = useMemo(() => order.some((pageIndex, index) => pageIndex !== index), [order]);

  const handleFile = async (files: File[]) => {
    try {
      const nextDocument = await loadPdfFile(files[0]);
      setDocument(nextDocument);
      setOrder(Array.from({ length: nextDocument.pageCount }, (_, index) => index));
      setError(null);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActivePage(Number(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActivePage(null);
    if (!over || active.id === over.id) {
      return;
    }

    setOrder((current) => {
      const oldIndex = current.indexOf(Number(active.id));
      const newIndex = current.indexOf(Number(over.id));
      return arrayMove(current, oldIndex, newIndex);
    });
  };

  const saveOrder = async () => {
    if (!document) return;
    setProcessing(true);
    setError(null);
    try {
      const output = await reorderPDF(document.bytes, order);
      downloadPDF(output, buildPageFilename(document.baseName, "reordered"));
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-wrap animate-fadeIn space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">Reorder PDF Pages Free</h1>
        <p className="max-w-2xl text-ink-muted dark:text-slate-300">
          Drag pages into a new sequence, reset if needed, and download a reordered PDF when you are happy.
        </p>
      </section>

      {!document ? (
        <FileDropzone multiple={false} onFilesSelected={handleFile} />
      ) : (
        <div className="card-surface flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="font-semibold">{document.name}</p>
            <p className="text-sm text-ink-muted dark:text-slate-300">
              Drag thumbnails to set the new page order.
            </p>
          </div>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setDocument(null);
              setOrder([]);
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
              <h2 className="font-semibold">Reorder pages</h2>
              <p className="text-sm text-ink-muted dark:text-slate-300">
                Current order updates live while you drag.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="secondary-button"
                disabled={!hasChanges}
                onClick={() => {
                  setOrder(Array.from({ length: document.pageCount }, (_, index) => index));
                }}
              >
                Reset Order
              </button>
              <button
                type="button"
                className="primary-button"
                disabled={!hasChanges || processing}
                onClick={() => void saveOrder()}
              >
                Save New Order
              </button>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={order} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {order.map((pageIndex, index) => (
                  <SortablePage
                    key={pageIndex}
                    pageIndex={pageIndex}
                    position={index + 1}
                    pdfBytes={document.bytes}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activePage !== null ? (
                <PageThumbnail
                  pdfBytes={document.bytes}
                  pageIndex={activePage}
                  label={`Position ${order.indexOf(activePage) + 1}`}
                  className="shadow-md"
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </>
      ) : null}

      {processing ? <ProcessingSpinner label="Saving new page order..." /> : null}
    </div>
  );
}
