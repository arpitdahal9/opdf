"use client";

import { useMemo, useState } from "react";

type UseFileUploadOptions = {
  multiple: boolean;
  maxSizeMB?: number;
  onFilesSelected?: (files: File[]) => void;
};

export function useFileUpload({
  multiple,
  maxSizeMB = 100,
  onFilesSelected,
}: UseFileUploadOptions) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const maxSizeBytes = useMemo(() => maxSizeMB * 1024 * 1024, [maxSizeMB]);

  const validateFiles = (incomingFiles: File[]) => {
    if (!incomingFiles.length) {
      return [];
    }

    const normalizedFiles = multiple ? incomingFiles : incomingFiles.slice(0, 1);
    const oversized = normalizedFiles.find((file) => file.size > maxSizeBytes);
    if (oversized) {
      throw new Error(`${oversized.name} exceeds the ${maxSizeMB} MB size limit.`);
    }

    return normalizedFiles;
  };

  const handleFiles = (input: FileList | File[] | null) => {
    try {
      const files = validateFiles(Array.from(input ?? []));
      if (!files.length) {
        return [];
      }
      setError(null);
      setSelectedFiles(files);
      onFilesSelected?.(files);
      return files;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to use the selected files.";
      setError(message);
      return [];
    }
  };

  return {
    selectedFiles,
    error,
    setError,
    setSelectedFiles,
    handleFiles,
  };
}
