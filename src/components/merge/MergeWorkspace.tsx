"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FileText, GripVertical, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import { mergePDFs } from "@/lib/pdf/merge";
import { formatFileSize, getFriendlyPdfError, loadPdfFile } from "@/lib/utils";
import type { UploadedPdfFile } from "@/types/pdf";

function SortableMergeCard({
  file,
  onRemove,
}: {
  file: UploadedPdfFile;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: file.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="card-surface flex items-center gap-3 p-4"
    >
      <button
        type="button"
        className="secondary-button min-h-10 px-3"
        aria-label={`Drag ${file.name}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary dark:bg-primary/15">
        <FileText className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{file.name}</p>
        <p className="text-sm text-ink-muted dark:text-slate-300">
          {file.pageCount} pages · {formatFileSize(file.size)}
        </p>
      </div>
      <button
        type="button"
        className="secondary-button min-h-10 px-3 text-danger hover:border-danger hover:text-danger"
        onClick={() => onRemove(file.id)}
        aria-label={`Remove ${file.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function MergeWorkspace() {
  const addMoreInputRef = useRef<HTMLInputElement | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const [files, setFiles] = useState<UploadedPdfFile[]>([]);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ingestFiles = async (incomingFiles: File[]) => {
    try {
      const loaded = await Promise.all(
        incomingFiles.map(async (file) => {
          const data = await loadPdfFile(file);
          return {
            id: crypto.randomUUID(),
            file,
            name: data.name,
            size: data.size,
            pageCount: data.pageCount,
            bytes: data.bytes,
          } satisfies UploadedPdfFile;
        }),
      );

      setFiles((current) => [...current, ...loaded]);
      setResult(null);
      setError(null);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    setFiles((current) => {
      const oldIndex = current.findIndex((file) => file.id === active.id);
      const newIndex = current.findIndex((file) => file.id === over.id);
      return arrayMove(current, oldIndex, newIndex);
    });
  };

  const handleMerge = async () => {
    setProcessing(true);
    setError(null);
    try {
      const merged = await mergePDFs(files.map((file) => file.bytes));
      setResult(merged);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-wrap animate-fadeIn space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">Merge PDF files</h1>
        <p className="max-w-2xl text-ink-muted dark:text-slate-300">
          Upload two or more PDFs, drag them into the exact order you want, and download a single merged file.
        </p>
      </section>

      <FileDropzone multiple onFilesSelected={ingestFiles} selectedFiles={files.map((item) => item.file)} />

      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {files.length > 0 ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">File order</h2>
              <p className="text-sm text-ink-muted dark:text-slate-300">
                Drag files to change the merge order.
              </p>
            </div>
            <div className="flex gap-3">
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
                disabled={files.length < 2 || processing}
                onClick={() => void handleMerge()}
              >
                Merge PDFs
              </button>
            </div>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={files.map((file) => file.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {files.map((file) => (
                  <SortableMergeCard
                    key={file.id}
                    file={file}
                    onRemove={(id) => {
                      setFiles((current) => current.filter((item) => item.id !== id));
                      setResult(null);
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>
      ) : null}

      {processing ? <ProcessingSpinner label="Merging PDFs..." /> : null}

      {result ? (
        <div className="card-surface flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <h2 className="font-semibold">Merged PDF ready</h2>
            <p className="text-sm text-ink-muted dark:text-slate-300">
              Your merged document has been prepared in the browser.
            </p>
          </div>
          <DownloadButton pdfBytes={result} filename="merged.pdf" />
        </div>
      ) : null}
    </div>
  );
}
