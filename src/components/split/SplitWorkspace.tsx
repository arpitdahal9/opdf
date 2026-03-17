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
import { Move, RotateCcw, RotateCw, X } from "lucide-react";
import { useMemo, useState } from "react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { PageThumbnail } from "@/components/shared/PageThumbnail";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import {
  resetPageItemRotations,
  updateAllPageRotations,
  updatePageItemRotation,
} from "@/lib/pdf/page-editor";
import { splitEditedPages } from "@/lib/pdf/split";
import { buildPageFilename, downloadPDF, getFriendlyPdfError, loadPdfFile, parsePageRange, randomUUID } from "@/lib/utils";
import type { PdfDocumentState, PdfPageItem } from "@/types/pdf";

function SortableSplitPage({
  item,
  position,
  selected,
  interactive,
  canDelete,
  onToggle,
  onRotate,
  onDelete,
}: {
  item: PdfPageItem;
  position: number;
  selected: boolean;
  interactive: boolean;
  canDelete: boolean;
  onToggle?: () => void;
  onRotate: (pageId: string, delta: number) => void;
  onDelete?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative ${isDragging ? "opacity-50" : ""}`}
    >
      {canDelete && onDelete ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute right-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-ink shadow-md transition hover:bg-danger hover:text-white hover:border-danger dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-danger dark:hover:text-white"
          aria-label={`Remove page ${position}`}
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
      <PageThumbnail
        pdfBytes={item.sourceBytes}
        pageIndex={item.sourcePageIndex}
        rotation={item.rotation}
        selected={selected}
        badge={item.rotation ? `${item.rotation}°` : undefined}
        label={`Position ${position}`}
        onClick={interactive ? onToggle : undefined}
        className="touch-none"
      >
        <button
          type="button"
          className="secondary-button min-h-10 px-3"
          aria-label={`Drag page ${position}`}
          {...attributes}
          {...listeners}
        >
          <Move className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="secondary-button min-h-10 px-3"
          onClick={() => onRotate(item.id, -90)}
          aria-label={`Rotate page ${position} left`}
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="secondary-button min-h-10 px-3"
          onClick={() => onRotate(item.id, 90)}
          aria-label={`Rotate page ${position} right`}
        >
          <RotateCw className="h-4 w-4" />
        </button>
      </PageThumbnail>
    </div>
  );
}

export function SplitWorkspace() {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const [document, setDocument] = useState<PdfDocumentState | null>(null);
  const [pageItems, setPageItems] = useState<PdfPageItem[]>([]);
  const [mode, setMode] = useState<"select" | "range">("select");
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [rangeInput, setRangeInput] = useState("");
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rangeState = useMemo(() => {
    if (!pageItems.length) {
      return { indices: [], normalized: "", error: null as string | null };
    }
    return parsePageRange(rangeInput, pageItems.length);
  }, [pageItems, rangeInput]);

  const rangePageIds = useMemo(
    () => rangeState.indices.map((index) => pageItems[index]?.id).filter(Boolean) as string[],
    [pageItems, rangeState.indices],
  );
  const activePageIds = mode === "select" ? selectedPageIds : rangePageIds;
  const selectedItems = useMemo(
    () => pageItems.filter((item) => activePageIds.includes(item.id)),
    [activePageIds, pageItems],
  );
  const activePage = activePageId ? pageItems.find((item) => item.id === activePageId) ?? null : null;

  const resetDocument = () => {
    setDocument(null);
    setPageItems([]);
    setSelectedPageIds([]);
    setRangeInput("");
    setError(null);
  };

  const handleFile = async (files: File[]) => {
    try {
      const nextDocument = await loadPdfFile(files[0]);
      setDocument(nextDocument);
      setPageItems(
        Array.from({ length: nextDocument.pageCount }, (_, index) => ({
          id: randomUUID(),
          sourceFileId: nextDocument.id,
          sourceFileName: nextDocument.name,
          sourceBaseName: nextDocument.baseName,
          sourcePageIndex: index,
          sourceBytes: nextDocument.bytes,
          rotation: 0,
        })),
      );
      setSelectedPageIds([]);
      setRangeInput("");
      setError(null);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    }
  };

  const runSplit = async (items: PdfPageItem[], filename: string) => {
    if (!document || !items.length) {
      return;
    }

    setProcessing(true);
    setError(null);
    try {
      const pdfBytes = await splitEditedPages(items);
      downloadPDF(pdfBytes, filename);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setProcessing(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActivePageId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActivePageId(null);
    if (!over || active.id === over.id) {
      return;
    }

    setPageItems((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id);
      const newIndex = current.findIndex((item) => item.id === over.id);
      return arrayMove(current, oldIndex, newIndex);
    });
  };

  const handleDeletePage = (itemId: string) => {
    setPageItems((current) => current.filter((item) => item.id !== itemId));
    setSelectedPageIds((current) => current.filter((id) => id !== itemId));
  };

  return (
    <div className="page-wrap animate-fadeIn space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">Split PDF Files</h1>
        <p className="max-w-2xl text-ink-muted dark:text-slate-300">
          Select pages, enter ranges, rotate pages, and reorder the final sequence freely before downloading the extracted PDF.
        </p>
        <p className="text-sm text-ink-muted dark:text-slate-400">
          All in one: pick specific pages (select mode) or use page ranges (e.g. 1–5, 8).
        </p>
      </section>

      {!document ? (
        <FileDropzone multiple={false} onFilesSelected={handleFile} />
      ) : (
        <div className="card-surface flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="font-semibold">{document.name}</p>
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
          <div className="glass-panel space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
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
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setPageItems((current) => updateAllPageRotations(current, -90))}
                >
                  Rotate All Left
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setPageItems((current) => updateAllPageRotations(current, 90))}
                >
                  Rotate All Right
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setPageItems((current) => resetPageItemRotations(current))}
                >
                  Reset Rotations
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="font-semibold">
                  {mode === "select" ? "Select pages to extract" : "Extract by current positions"}
                </h2>
                <p className="text-sm text-ink-muted dark:text-slate-300">
                  {mode === "select"
                    ? "Click thumbnails to toggle pages. Reorder and rotate whenever you want."
                    : "Ranges follow the current displayed order after any reordering."}
                </p>
              </div>
              <button
                type="button"
                className="primary-button"
                disabled={!selectedItems.length || processing}
                onClick={() =>
                  void runSplit(
                    selectedItems,
                    buildPageFilename(
                      document.baseName,
                      `pages_${
                        mode === "select"
                          ? selectedItems
                              .map((item) => pageItems.findIndex((page) => page.id === item.id) + 1)
                              .join("-")
                          : rangeState.normalized || "split"
                      }`,
                    ),
                  )
                }
              >
                Download Extracted PDF
              </button>
            </div>
          </div>

          {mode === "select" ? (
            <div className="glass-panel flex flex-wrap items-center justify-between gap-3 p-5">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setSelectedPageIds(pageItems.map((item) => item.id))}
                >
                  Select All
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setSelectedPageIds([])}
                >
                  Deselect All
                </button>
              </div>
              <div className="text-sm text-ink-muted dark:text-slate-300">
                {selectedItems.length} page{selectedItems.length === 1 ? "" : "s"} selected
              </div>
            </div>
          ) : (
            <div className="glass-panel space-y-3 p-5">
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
              {rangeState.error ? <p className="text-sm text-danger">{rangeState.error}</p> : null}
            </div>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={pageItems.map((item) => item.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
                {pageItems.map((item, index) => (
                  <SortableSplitPage
                    key={item.id}
                    item={item}
                    position={index + 1}
                    selected={activePageIds.includes(item.id)}
                    interactive={mode === "select"}
                    canDelete={pageItems.length > 1}
                    onToggle={
                      mode === "select"
                        ? () =>
                            setSelectedPageIds((current) =>
                              current.includes(item.id)
                                ? current.filter((pageId) => pageId !== item.id)
                                : [...current, item.id],
                            )
                        : undefined
                    }
                    onRotate={(pageId, delta) => {
                      setPageItems((current) => updatePageItemRotation(current, pageId, delta));
                    }}
                    onDelete={() => handleDeletePage(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activePage ? (
                <PageThumbnail
                  pdfBytes={activePage.sourceBytes}
                  pageIndex={activePage.sourcePageIndex}
                  rotation={activePage.rotation}
                  badge={activePage.rotation ? `${activePage.rotation}°` : undefined}
                  className="shadow-md"
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </>
      ) : null}

      {processing ? <ProcessingSpinner label="Creating split PDF..." /> : null}

    </div>
  );
}
