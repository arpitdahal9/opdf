import { type ClassValue, clsx } from "clsx";
import { PDFDocument } from "pdf-lib";
import { twMerge } from "tailwind-merge";

import type { PdfDocumentState } from "@/types/pdf";

/** UUID v4. Uses crypto.randomUUID() when available, else getRandomValues() for mobile/older browsers. */
export function randomUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export const PDF_PROCESSING_ERROR_MESSAGE =
  "This PDF couldn't be processed. It may be password-protected or corrupted.";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / 1024 ** unitIndex;

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function downloadPDF(pdfBytes: Uint8Array, filename: string) {
  const arrayBuffer = pdfBytes.buffer.slice(
    pdfBytes.byteOffset,
    pdfBytes.byteOffset + pdfBytes.byteLength,
  ) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function fileToUint8Array(file: File) {
  return new Uint8Array(await file.arrayBuffer());
}

export function getBaseName(filename: string) {
  return filename.replace(/\.pdf$/i, "");
}

export function getFriendlyPdfError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  const lower = message.toLowerCase();

  if (lower.includes("password") || lower.includes("encrypted")) {
    return PDF_PROCESSING_ERROR_MESSAGE;
  }

  // For non-password issues, surface the original error if we have one.
  if (message) {
    return message;
  }

  return PDF_PROCESSING_ERROR_MESSAGE;
}

export function downloadBytes(bytes: Uint8Array, filename: string, mimeType: string) {
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function loadPdfFile(file: File): Promise<PdfDocumentState> {
  try {
    const bytes = await fileToUint8Array(file);
    const pdf = await PDFDocument.load(bytes);
    return {
      id: randomUUID(),
      file,
      name: file.name,
      size: file.size,
      pageCount: pdf.getPageCount(),
      bytes,
      baseName: getBaseName(file.name),
    };
  } catch (error) {
    throw new Error(getFriendlyPdfError(error));
  }
}

export function buildPageFilename(baseName: string, suffix: string) {
  return `${baseName}_${suffix.replace(/\s+/g, "_")}.pdf`;
}

export function parsePageRange(input: string, totalPages: number) {
  const raw = input.trim();
  if (!raw) {
    return { indices: [], normalized: "", error: "Enter one or more pages or ranges." };
  }

  const seen = new Set<number>();
  const indices: number[] = [];
  const cleanedTokens = raw
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);

  if (!cleanedTokens.length) {
    return { indices: [], normalized: "", error: "Enter one or more pages or ranges." };
  }

  for (const token of cleanedTokens) {
    if (/^\d+$/.test(token)) {
      const page = Number(token);
      if (page < 1 || page > totalPages) {
        return { indices: [], normalized: "", error: `Page ${page} is outside the document.` };
      }
      const index = page - 1;
      if (!seen.has(index)) {
        seen.add(index);
        indices.push(index);
      }
      continue;
    }

    const rangeMatch = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (!rangeMatch) {
      return { indices: [], normalized: "", error: `"${token}" is not a valid page range.` };
    }

    const start = Number(rangeMatch[1]);
    const end = Number(rangeMatch[2]);
    if (start < 1 || end < 1 || start > totalPages || end > totalPages || start > end) {
      return { indices: [], normalized: "", error: `"${token}" is outside the document bounds.` };
    }

    for (let page = start; page <= end; page += 1) {
      const index = page - 1;
      if (!seen.has(index)) {
        seen.add(index);
        indices.push(index);
      }
    }
  }

  const normalized = indices.map((index) => index + 1).join("-");

  return { indices, normalized, error: null as string | null };
}
