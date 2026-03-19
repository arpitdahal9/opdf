"use client";

import JSZip from "jszip";
import { Download } from "lucide-react";
import { useState } from "react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { PageThumbnail } from "@/components/shared/PageThumbnail";
import { ProcessingSpinner } from "@/components/shared/ProcessingSpinner";
import { getPdfPageCount, renderPdfPageToImage } from "@/lib/pdf/pdfToImage";
import { fileToUint8Array, getFriendlyPdfError } from "@/lib/utils";

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function PdfToImageWorkspace() {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPage, setDownloadingPage] = useState<number | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<number | null>(null);

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setError(null);
    setPdfBytes(null);
    setPageCount(0);
    try {
      const bytes = await fileToUint8Array(file);
      const count = await getPdfPageCount(bytes);
      setPdfBytes(bytes);
      setFileName(file.name.replace(/\.pdf$/i, "") || "page");
      setPageCount(count);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    }
  }

  async function downloadPageAsJpg(pageIndex: number) {
    if (!pdfBytes) return;
    setDownloadingPage(pageIndex);
    try {
      const dataUrl = await renderPdfPageToImage(pdfBytes, pageIndex, {
        format: "jpeg",
        scale: 2,
        quality: 0.92,
      });
      downloadDataUrl(dataUrl, `${fileName}-page-${pageIndex + 1}.jpg`);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setDownloadingPage(null);
    }
  }

  async function downloadAllAsJpg() {
    if (!pdfBytes || !pageCount) return;
    setDownloadingAll(true);
    setBulkProgress(0);
    setError(null);

    try {
      const zip = new JSZip();

      for (let i = 0; i < pageCount; i += 1) {
        const dataUrl = await renderPdfPageToImage(pdfBytes, i, {
          format: "jpeg",
          scale: 2,
          quality: 0.92,
        });
        const bytes = dataUrlToUint8Array(dataUrl);
        zip.file(`${fileName}-page-${i + 1}.jpg`, bytes);
        setBulkProgress(Math.round(((i + 1) / pageCount) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipName = `${fileName || "pages"}.zip`;
      downloadBlob(zipBlob, zipName);
    } catch (err) {
      setError(getFriendlyPdfError(err));
    } finally {
      setDownloadingAll(false);
      setBulkProgress(null);
    }
  }

  if (!pdfBytes) {
    return (
      <div className="page-wrap animate-fadeIn space-y-6">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold">PDF to JPG</h1>
          <p className="text-gray-600 dark:text-slate-300">
            Convert each PDF page to a JPG image. No upload — everything runs in your browser.
          </p>
        </section>
        {error ? (
          <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        ) : null}
        <FileDropzone
          multiple={false}
          accept="application/pdf"
          onFilesSelected={handleFile}
          helperText="Select a PDF to convert its pages to JPG images."
        showProBatchHint
        />
      </div>
    );
  }

  const isDownloading = downloadingPage !== null || downloadingAll;

  return (
    <div className="page-wrap animate-fadeIn space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">PDF to JPG</h1>
        <p className="text-gray-600 dark:text-slate-300">
          {pageCount} {pageCount === 1 ? "page" : "pages"}. Download individual pages or the entire PDF as JPG images.
        </p>
      </section>

      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Downloaded images will be saved as <code className="font-mono text-xs">{fileName}-page-N.jpg</code>.
        </p>
        <button
          type="button"
          className="primary-button"
          disabled={isDownloading}
          onClick={() => void downloadAllAsJpg()}
        >
          {downloadingAll ? "Downloading all pages…" : "Download all pages as JPG"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: pageCount }, (_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-white dark:bg-gray-900 overflow-hidden"
          >
            <div className="relative bg-gray-100 dark:bg-[#0d132a] min-h-[160px] flex items-center justify-center p-2 overflow-hidden">
              <PageThumbnail
                pdfBytes={pdfBytes}
                pageIndex={i}
                width={200}
                compact
                hidePageBadge
                className="max-h-[160px] w-auto"
              />
            </div>
            <div className="flex items-center justify-between gap-2 p-3 border-t border-border dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Page {i + 1}
              </span>
              <button
                type="button"
                className="secondary-button gap-2 text-sm"
                disabled={isDownloading}
                onClick={() => downloadPageAsJpg(i)}
              >
                <Download className="h-4 w-4" />
                {downloadingPage === i ? "Converting…" : "Download as JPG"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isDownloading ? (
        <ProcessingSpinner
          label={
            downloadingAll && bulkProgress !== null
              ? `Converting PDF to JPGs… (${bulkProgress}%)`
              : "Converting page to JPG…"
          }
        />
      ) : null}

      <FileDropzone
        multiple={false}
        accept="application/pdf"
        onFilesSelected={handleFile}
        helperText="Choose another PDF to convert."
        showProBatchHint
      />
    </div>
  );
}
