"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import { downloadBytes, getFriendlyPdfError } from "@/lib/utils";

export function ImageToTextTool() {
  const [text, setText] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setError(null);
    setText("");
    setFileName(file.name);
    setProcessing(true);

    try {
      const result = await Tesseract.recognize(file, "eng");
      setText(result.data.text || "");
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setProcessing(false);
    }
  }

  function downloadText() {
    const safeBase = (fileName || "image").replace(/\.[^/.]+$/, "") || "image";
    const bytes = new TextEncoder().encode(text);
    downloadBytes(bytes, `${safeBase}.txt`, "text/plain");
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <FileDropzone
        multiple={false}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onFilesSelected={handleFile}
        helperText="Select an image (PNG/JPG/WebP/GIF) and we’ll extract text in your browser."
        label="Drop image here or click to browse"
        showProBatchHint
      />

      {processing ? <ProcessingSpinner label="Extracting text from image (OCR)..." /> : null}

      {text && !processing ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Extracted text</p>
              {fileName ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">{fileName}</p>
              ) : null}
            </div>
            <button type="button" className="secondary-button text-xs" onClick={downloadText}>
              Download as .txt
            </button>
          </div>
          <textarea
            className="field-input h-64 resize-y text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      ) : null}
    </div>
  );
}

