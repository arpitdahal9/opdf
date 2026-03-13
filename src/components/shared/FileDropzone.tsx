"use client";

import { FileText, Upload } from "lucide-react";
import { useRef, useState } from "react";

import { useFileUpload } from "@/hooks/useFileUpload";
import { cn, formatFileSize } from "@/lib/utils";

export function FileDropzone({
  multiple,
  onFilesSelected,
  maxSizeMB = 100,
  selectedFiles,
  helperText,
}: {
  multiple: boolean;
  onFilesSelected: (files: File[]) => void;
  maxSizeMB?: number;
  selectedFiles?: File[];
  helperText?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { handleFiles, error, selectedFiles: localFiles } = useFileUpload({
    multiple,
    maxSizeMB,
    onFilesSelected,
  });

  const filesToDisplay = selectedFiles ?? localFiles;

  const updateFiles = (files: FileList | null) => {
    handleFiles(files);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
            return;
          }
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          updateFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-200",
          isDragging
            ? "border-primary bg-primary-soft/70 dark:bg-primary/10"
            : "border-border bg-white hover:border-primary/60 hover:bg-primary-soft/40 dark:border-slate-700 dark:bg-darksurface dark:hover:bg-primary/10",
        )}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary dark:bg-primary/15">
          <Upload className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold">Drop PDF here or click to browse</p>
          <p className="text-sm text-ink-muted dark:text-slate-300">
            {multiple ? "Choose one or more PDF files" : "Choose a single PDF file"}. Max{" "}
            {maxSizeMB} MB each.
          </p>
          {helperText ? (
            <p className="text-sm text-ink-muted dark:text-slate-400">{helperText}</p>
          ) : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple={multiple}
          className="hidden"
          onChange={(event) => updateFiles(event.target.files)}
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {filesToDisplay.length ? (
        <div className="card-surface p-4">
          <p className="text-sm font-semibold">Selected files</p>
          <ul className="mt-3 space-y-2">
            {filesToDisplay.map((file) => (
              <li key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3 text-sm">
                <span className="inline-flex min-w-0 items-center gap-2 text-ink-muted dark:text-slate-300">
                  <FileText className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate">{file.name}</span>
                </span>
                <span className="shrink-0 text-xs text-ink-muted dark:text-slate-400">
                  {formatFileSize(file.size)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
