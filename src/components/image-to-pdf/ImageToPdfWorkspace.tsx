"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Move } from "lucide-react";
import { useState } from "react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import { imagesToPdf } from "@/lib/pdf/imageToPdf";
import { downloadPDF, fileToUint8Array, formatFileSize, getFriendlyPdfError, randomUUID } from "@/lib/utils";

type ImageItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  bytes: Uint8Array;
  mimeType: string;
  previewUrl: string;
};

function SortableImageCard({
  item,
  position,
}: {
  item: ImageItem;
  position: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-50" : undefined}
    >
      <div className="space-y-3">
        <div className="group relative overflow-hidden rounded-lg border border-border bg-white shadow-sm">
          <div className="relative flex min-h-[160px] items-center justify-center overflow-hidden bg-[#0d132a] p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.previewUrl}
              alt={item.name}
              className="max-h-[160px] w-auto max-w-full rounded-md object-contain shadow-sm"
            />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-white">
              Image {position}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 text-xs text-gray-600 dark:text-slate-300">
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-900 dark:text-white">{item.name}</p>
            <p className="mt-0.5">{formatFileSize(item.size)}</p>
          </div>
          <button
            type="button"
            className="secondary-button min-h-9 px-3"
            aria-label={`Reorder ${item.name}`}
            {...attributes}
            {...listeners}
          >
            <Move className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ImageToPdfWorkspace() {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const [images, setImages] = useState<ImageItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    try {
      const nextItems: ImageItem[] = [];

      for (const file of files) {
        const mimeType = file.type || "application/octet-stream";
        const bytes = await fileToUint8Array(file);
        const previewUrl = URL.createObjectURL(file);

        nextItems.push({
          id: randomUUID(),
          file,
          name: file.name,
          size: file.size,
          bytes,
          mimeType,
          previewUrl,
        });
      }

      setImages((current) => [...current, ...nextItems]);
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

    setImages((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id);
      const newIndex = current.findIndex((item) => item.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return current;
      return arrayMove(current, oldIndex, newIndex);
    });
  };

  const handleCreatePdf = async () => {
    if (!images.length) return;
    setProcessing(true);
    setError(null);

    try {
      const pdfBytes = await imagesToPdf(
        images.map((item) => ({ bytes: item.bytes, mimeType: item.mimeType })),
        "fit-to-image",
      );
      downloadPDF(pdfBytes, "images.pdf");
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-wrap animate-fadeIn space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">Convert Images to PDF</h1>
        <p className="max-w-2xl text-gray-600 dark:text-slate-300">
          Turn multiple images into a single, clean PDF. Reorder pages and download instantly — all
          in your browser.
        </p>
      </section>

      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {images.length ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={images.map((item) => item.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {images.map((item, index) => (
                <SortableImageCard key={item.id} item={item} position={index + 1} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : null}

      <FileDropzone
        multiple
        onFilesSelected={(files) => void handleFilesSelected(files)}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        label="Drop images here or click to browse"
        helperText="Upload JPG, PNG, WebP, or GIF images (up to 100 MB each). They will become pages in your PDF."
        showProBatchHint
      />

      {processing ? <ProcessingSpinner label="Creating PDF from images..." /> : null}

      <div className="flex justify-end">
        <button
          type="button"
          className="primary-button"
          disabled={!images.length || processing}
          onClick={() => void handleCreatePdf()}
        >
          Create PDF
        </button>
      </div>
    </div>
  );
}

