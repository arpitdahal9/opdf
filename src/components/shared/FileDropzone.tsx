"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";

import { useFileUpload } from "@/hooks/useFileUpload";
import { cn } from "@/lib/utils";

export function FileDropzone({
  multiple,
  onFilesSelected,
  maxSizeMB = 100,
  helperText,
  accept = "application/pdf",
  label,
}: {
  multiple: boolean;
  onFilesSelected: (files: File[]) => void;
  maxSizeMB?: number;
  helperText?: string;
  accept?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { handleFiles, error } = useFileUpload({
    multiple,
    maxSizeMB,
    onFilesSelected,
  });

  const updateFiles = (files: FileList | null) => {
    handleFiles(files);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
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
          "glass-panel flex cursor-pointer flex-col items-center justify-center gap-4 border-2 border-dashed px-6 py-14 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary/60 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-primary/60 dark:hover:bg-white/[0.06]",
        )}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Upload className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            {label ?? "Drop file here or click to browse"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {multiple ? "Choose one or more PDF files" : "Choose a single PDF file"}. Max{" "}
            {maxSizeMB} MB each.
          </p>
          {helperText ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
          ) : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(event) => updateFiles(event.target.files)}
        />
      </div>

      <p className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
        <span role="img" aria-hidden>
          🔒
        </span>
        <span>Your files are processed in your browser and never leave this device.</span>
      </p>

      {error ? (
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}
    </div>
  );
}
