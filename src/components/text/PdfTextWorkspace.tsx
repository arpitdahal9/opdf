"use client";

import { useState } from "react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import { extractTextFromPdf } from "@/lib/pdf/pdfToText";
import { downloadPDF, fileToUint8Array, getFriendlyPdfError } from "@/lib/utils";
import { PDFDocument } from "pdf-lib";

type Mode = "pdf-to-text" | "text-to-pdf";

export function PdfTextWorkspace() {
  const [mode, setMode] = useState<Mode>("pdf-to-text");
  const [inputFileName, setInputFileName] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setInputFileName(null);
    setText("");
    setError(null);
  };

  const handlePdfSelected = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setProcessing(true);
    setError(null);
    setText("");

    try {
      const bytes = await fileToUint8Array(file);
      const extracted = await extractTextFromPdf(bytes);
      setInputFileName(file.name);
      setText(extracted);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadText = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const base = inputFileName?.replace(/\.pdf$/i, "") || "document";
    a.download = `${base}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdfFromText = async () => {
    if (!text.trim()) return;
    setProcessing(true);
    setError(null);

    try {
      const pdf = await PDFDocument.create();
      const page = pdf.addPage();
      const { width, height } = page.getSize();

      const fontSize = 12;
      const margin = 50;
      const maxWidth = width - margin * 2;

      const lines = text.split(/\r?\n/);
      let cursorY = height - margin;

      for (const line of lines) {
        const words = line.split(" ");
        let currentLine = "";

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const testWidth = testLine.length * (fontSize * 0.6);

          if (testWidth > maxWidth) {
            page.drawText(currentLine, { x: margin, y: cursorY, size: fontSize });
            cursorY -= fontSize * 1.4;
            currentLine = word;

            if (cursorY < margin) {
              cursorY = height - margin;
              const newPage = pdf.addPage();
              const size = newPage.getSize();
              page.setSize(size.width, size.height);
            }
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine) {
          page.drawText(currentLine, { x: margin, y: cursorY, size: fontSize });
          cursorY -= fontSize * 1.4;
        }

        if (cursorY < margin) {
          cursorY = height - margin;
          const newPage = pdf.addPage();
          const size = newPage.getSize();
          page.setSize(size.width, size.height);
        }
      }

      const pdfBytes = await pdf.save();
      const base = inputFileName?.replace(/\.txt$/i, "") || "text";
      downloadPDF(pdfBytes, `${base}.pdf`);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-wrap animate-fadeIn space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">
          {mode === "pdf-to-text" ? "PDF to Text (and back)" : "Text to PDF (and back)"}
        </h1>
        <p className="max-w-2xl text-ink-muted dark:text-slate-300">
          Extract text from PDFs using pdf.js, or paste text and turn it into a simple PDF — all in your browser.
        </p>
      </section>

      <section className="glass-panel flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={mode === "pdf-to-text" ? "primary-button" : "secondary-button"}
            onClick={() => {
              setMode("pdf-to-text");
              resetState();
            }}
          >
            PDF to Text
          </button>
          <button
            type="button"
            className={mode === "text-to-pdf" ? "primary-button" : "secondary-button"}
            onClick={() => {
              setMode("text-to-pdf");
              resetState();
            }}
          >
            Text to PDF
          </button>
        </div>
        {inputFileName ? (
          <p className="text-sm text-ink-muted dark:text-slate-300 truncate max-w-xs">
            Selected: <span className="font-medium">{inputFileName}</span>
          </p>
        ) : null}
      </section>

      {mode === "pdf-to-text" ? (
        <section className="space-y-4">
          <FileDropzone
            multiple={false}
            accept="application/pdf"
            onFilesSelected={handlePdfSelected}
            helperText="Drop a PDF here or click to choose one. We'll extract the text in your browser."
          />
          {error ? (
            <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : null}
          {processing ? <ProcessingSpinner label="Extracting text from PDF..." /> : null}
          {text && !processing ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Extracted text</h2>
                <button type="button" className="secondary-button text-xs" onClick={handleDownloadText}>
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
        </section>
      ) : (
        <section className="space-y-4">
          {error ? (
            <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : null}
          <textarea
            className="field-input h-64 resize-y text-sm"
            placeholder="Paste or type your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              type="button"
              className="primary-button"
              disabled={!text.trim() || processing}
              onClick={() => void handleDownloadPdfFromText()}
            >
              Download as PDF
            </button>
          </div>
          {processing ? <ProcessingSpinner label="Creating PDF from text..." /> : null}
        </section>
      )}
    </div>
  );
}

