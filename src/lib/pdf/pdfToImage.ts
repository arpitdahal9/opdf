/**
 * Render a single PDF page to an image (JPEG or PNG) using pdf.js.
 */

let pdfJsPromise: Promise<typeof import("pdfjs-dist/legacy/build/pdf.mjs")> | null = null;
const workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

async function getPdfJs() {
  if (!pdfJsPromise) {
    pdfJsPromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
      return pdfjs;
    });
  }
  return pdfJsPromise;
}

export type ImageFormat = "jpeg" | "png";

export interface RenderOptions {
  /** Scale factor (default 2 for good quality). */
  scale?: number;
  format?: ImageFormat;
  /** JPEG quality 0–1 (default 0.92). */
  quality?: number;
}

/**
 * Render one PDF page to a data URL (image/jpeg or image/png).
 */
export async function renderPdfPageToImage(
  pdfBytes: Uint8Array,
  pageIndex: number,
  options: RenderOptions = {},
): Promise<string> {
  const { scale = 2, format = "jpeg", quality = 0.92 } = options;
  const pdfjs = await getPdfJs();
  const { getDocument } = pdfjs;
  const pdf = await getDocument({ data: pdfBytes.slice(0) }).promise;
  const page = await pdf.getPage(pageIndex + 1);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    await pdf.destroy();
    throw new Error("Canvas rendering is not available in this browser.");
  }

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvas,
    canvasContext: context,
    viewport,
    intent: "display",
  }).promise;

  const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
  const dataUrl =
    format === "jpeg"
      ? canvas.toDataURL(mimeType, quality)
      : canvas.toDataURL(mimeType);

  page.cleanup();
  await pdf.destroy();
  return dataUrl;
}

/**
 * Get the number of pages in a PDF (client-side).
 */
export async function getPdfPageCount(pdfBytes: Uint8Array): Promise<number> {
  const pdfjs = await getPdfJs();
  const { getDocument } = pdfjs;
  const pdf = await getDocument({ data: pdfBytes.slice(0) }).promise;
  const count = pdf.numPages;
  await pdf.destroy();
  return count;
}
