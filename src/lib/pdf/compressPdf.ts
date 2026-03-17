import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

export type CompressionLevel = "low" | "medium" | "high";

type CompressPdfOptions = {
  file: ArrayBuffer | Uint8Array;
  level: CompressionLevel;
  onProgress?: (currentPage: number, totalPages: number) => void;
};

type CompressPdfResult = {
  data: Uint8Array;
  originalSize: number;
  compressedSize: number;
  reductionPercent: number;
};

const LEVEL_SETTINGS: Record<
  CompressionLevel,
  {
    quality: number;
    scale: number;
  }
> = {
  low: {
    // Near-identical quality, modest size reduction
    quality: 0.85,
    scale: 2.0,
  },
  medium: {
    // Good balance, noticeable size drop
    quality: 0.6,
    scale: 1.5,
  },
  high: {
    // Aggressive, significant compression
    quality: 0.35,
    scale: 1.2,
  },
};

// Configure pdf.js worker to use a locally served worker script.
// The worker file is copied to `public/pdf.worker.min.mjs` at build/dev time.
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = typeof atob !== "undefined" ? atob(base64) : "";
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function compressPdf(options: CompressPdfOptions): Promise<CompressPdfResult> {
  const { file, level, onProgress } = options;

  const inputBytes = file instanceof Uint8Array ? file : new Uint8Array(file);
  const originalSize = inputBytes.byteLength;

  // Load source PDF with pdf.js for rendering
  const loadingTask = pdfjsLib.getDocument({ data: inputBytes });
  const pdf = await loadingTask.promise;

  const totalPages = pdf.numPages;
  const { quality, scale } = LEVEL_SETTINGS[level];

  const outPdf = await PDFDocument.create();

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);

    // Get original page dimensions (scale = 1)
    const baseViewport = page.getViewport({ scale: 1 });

    // Render at a higher scale for quality, then downsample via JPEG compression
    const renderViewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas 2D context unavailable while compressing PDF.");
    }

    canvas.width = renderViewport.width;
    canvas.height = renderViewport.height;

    await page.render({ canvasContext: context, viewport: renderViewport }).promise;

    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    const imageBytes = dataUrlToUint8Array(dataUrl);

    const jpgImage = await outPdf.embedJpg(imageBytes);
    const outPage = outPdf.addPage([baseViewport.width, baseViewport.height]);

    const { width, height } = jpgImage.scaleToFit(baseViewport.width, baseViewport.height);

    outPage.drawImage(jpgImage, {
      x: (baseViewport.width - width) / 2,
      y: (baseViewport.height - height) / 2,
      width,
      height,
    });

    if (onProgress) {
      onProgress(pageNumber, totalPages);
    }
  }

  const compressedBytes = await outPdf.save();
  const compressedSize = compressedBytes.byteLength;

  const reductionPercent =
    compressedSize < originalSize
      ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
      : 0;

  return {
    data: compressedBytes,
    originalSize,
    compressedSize,
    reductionPercent,
  };
}
