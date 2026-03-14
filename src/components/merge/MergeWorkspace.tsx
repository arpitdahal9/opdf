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
import { FileText, LayoutGrid, List, Move, Plus, RotateCcw, RotateCw, Trash2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { PageThumbnail } from "@/components/shared/PageThumbnail";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import { mergeEditedPages } from "@/lib/pdf/merge";
import {
  createPageItemsFromDocuments,
  updatePageItemRotation,
} from "@/lib/pdf/page-editor";
import { downloadPDF, formatFileSize, getFriendlyPdfError, loadPdfFile } from "@/lib/utils";
import type { PdfPageItem, UploadedPdfFile } from "@/types/pdf";

function SortableMergePage({
  item,
  position,
  onRotate,
  sourceLabel,
}: {
  item: PdfPageItem;
  position: number;
  onRotate: (pageId: string, delta: number) => void;
  sourceLabel?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const label = sourceLabel ? `#${position} · ${sourceLabel}` : `Position ${position}`;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-50" : undefined}
    >
      <PageThumbnail
        pdfBytes={item.sourceBytes}
        pageIndex={item.sourcePageIndex}
        rotation={item.rotation}
        badge={item.rotation ? `${item.rotation}°` : undefined}
        label={label}
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

function getContiguousGroups(items: PdfPageItem[]) {
  return items.reduce<
    Array<{ sourceFileId: string; sourceFileName: string; sourceBaseName: string; items: PdfPageItem[] }>
  >((groups, item) => {
    const currentGroup = groups.at(-1);
    if (!currentGroup || currentGroup.sourceFileId !== item.sourceFileId) {
      groups.push({
        sourceFileId: item.sourceFileId,
        sourceFileName: item.sourceFileName,
        sourceBaseName: item.sourceBaseName,
        items: [item],
      });
    } else {
      currentGroup.items.push(item);
    }
    return groups;
  }, []);
}

export function MergeWorkspace() {
  const addMoreInputRef = useRef<HTMLInputElement | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const [files, setFiles] = useState<UploadedPdfFile[]>([]);
  const [pageItems, setPageItems] = useState<PdfPageItem[]>([]);
  const [expandedFileIds, setExpandedFileIds] = useState<Set<string>>(new Set());
  const [reorderView, setReorderView] = useState<"all-pages" | "by-file">("all-pages");
  const [activePageId, setActivePageId] = useState<string | null>(null);

  const toggleExpanded = (fileId: string) => {
    setExpandedFileIds((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) next.delete(fileId);
      else next.add(fileId);
      return next;
    });
  };
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groups = useMemo(() => getContiguousGroups(pageItems), [pageItems]);
  const activePage = activePageId ? pageItems.find((item) => item.id === activePageId) ?? null : null;

  const ingestFiles = async (incomingFiles: File[]) => {
    try {
      const loaded = await Promise.all(
        incomingFiles.map(async (file) => {
          const data = await loadPdfFile(file);
          return {
            ...data,
          } satisfies UploadedPdfFile;
        }),
      );

      setFiles((current) => [...current, ...loaded]);
      setPageItems((current) => [...current, ...createPageItemsFromDocuments(loaded)]);
      setError(null);
    } catch (err) {
      setError(getFriendlyPdfError(err));
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

  const handleMerge = async () => {
    setProcessing(true);
    setError(null);
    try {
      const merged = await mergeEditedPages(pageItems);
      downloadPDF(merged, "merged.pdf");
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-wrap animate-fadeIn space-y-8">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Merge PDF files</h1>
          <p className="max-w-2xl text-gray-600 dark:text-slate-300">
            Upload multiple PDFs, then rotate and reorder pages before downloading a single combined file. You can reorder when merging as well—drag pages into the order you want.
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            All in one: merge, reorder, and rotate pages in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            ref={addMoreInputRef}
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={(event) => {
              const inputFiles = Array.from(event.target.files ?? []);
              if (inputFiles.length) {
                void ingestFiles(inputFiles);
              }
              event.target.value = "";
            }}
          />
          <button
            type="button"
            className="secondary-button gap-2"
            onClick={() => addMoreInputRef.current?.click()}
          >
            <Plus className="h-4 w-4" />
            Add files
          </button>
          <button
            type="button"
            className="primary-button"
            disabled={pageItems.length < 2 || processing}
            onClick={() => void handleMerge()}
          >
            Merge PDFs
          </button>
        </div>
      </section>

      {!files.length ? <FileDropzone multiple onFilesSelected={ingestFiles} /> : null}

      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {files.length > 0 ? (
        <section className="space-y-4">
          <div className="glass-panel flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-600 dark:text-slate-300">Reorder view:</span>
              <div className="flex rounded-lg border border-border bg-gray-50 p-0.5 dark:border-gray-700 dark:bg-gray-800">
                <button
                  type="button"
                  onClick={() => setReorderView("all-pages")}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    reorderView === "all-pages"
                      ? "bg-white text-primary shadow dark:bg-gray-700 dark:text-primary"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                  title="See all pages in one list — drag any page to any position"
                >
                  <LayoutGrid className="h-4 w-4" />
                  All pages
                </button>
                <button
                  type="button"
                  onClick={() => setReorderView("by-file")}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    reorderView === "by-file"
                      ? "bg-white text-primary shadow dark:bg-gray-700 dark:text-primary"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                  title="Group pages by source file"
                >
                  <List className="h-4 w-4" />
                  By file
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {reorderView === "all-pages"
                ? "All pages visible — drag freely to any position."
                : "Expand a file to see and reorder its pages."}
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={pageItems.map((item) => item.id)}
              strategy={rectSortingStrategy}
            >
              {reorderView === "all-pages" ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-slate-300">
                    {pageItems.length} page{pageItems.length !== 1 ? "s" : ""} in merge order. Drag any page to reorder.
                  </p>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {pageItems.map((item, index) => (
                      <SortableMergePage
                        key={item.id}
                        item={item}
                        position={index + 1}
                        onRotate={(pageId, delta) => {
                          setPageItems((current) => updatePageItemRotation(current, pageId, delta));
                        }}
                        sourceLabel={item.sourceBaseName}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                {groups.map((group) => {
                  const isExpanded = expandedFileIds.has(group.sourceFileId);
                  return (
                    <section key={group.sourceFileId} className="space-y-4">
                      <div className="glass-panel flex flex-wrap items-center justify-between gap-3 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{group.sourceFileName}</h3>
                            <p className="text-sm text-gray-600 dark:text-slate-300">
                              {group.items.length} pages in the current merge sequence
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <span className="secondary-button pointer-events-none px-4">
                            {formatFileSize(files.find((file) => file.id === group.sourceFileId)?.size ?? 0)}
                          </span>
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() => toggleExpanded(group.sourceFileId)}
                          >
                            {isExpanded ? "Collapse pages" : "Expand pages"}
                          </button>
                          <button
                            type="button"
                            className="secondary-button gap-2 text-danger hover:border-danger hover:text-danger"
                            onClick={() => {
                              const nextFiles = files.filter((file) => file.id !== group.sourceFileId);
                              setFiles(nextFiles);
                              setPageItems((current) =>
                                current.filter((item) => item.sourceFileId !== group.sourceFileId),
                              );
                              setExpandedFileIds((prev) => {
                                const next = new Set(prev);
                                next.delete(group.sourceFileId);
                                return next;
                              });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove file
                          </button>
                        </div>
                      </div>

                      {isExpanded ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
                          {group.items.map((item) => (
                            <SortableMergePage
                              key={item.id}
                              item={item}
                              position={pageItems.findIndex((page) => page.id === item.id) + 1}
                              onRotate={(pageId, delta) => {
                                setPageItems((current) => updatePageItemRotation(current, pageId, delta));
                              }}
                            />
                          ))}
                        </div>
                      ) : null}
                    </section>
                  );
                })}
                </div>
              )}
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

          <FileDropzone
            multiple
            onFilesSelected={ingestFiles}
            helperText="Add more PDFs to keep expanding your merge canvas."
          />
        </section>
      ) : null}

      {processing ? <ProcessingSpinner label="Merging PDFs..." /> : null}
    </div>
  );
}
