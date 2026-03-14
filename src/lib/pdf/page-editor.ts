import { PDFDocument, degrees } from "pdf-lib";

import { getFriendlyPdfError, randomUUID } from "@/lib/utils";
import type { PdfDocumentState, PdfPageItem, UploadedPdfFile } from "@/types/pdf";

export function normalizeRotation(value: number) {
  return ((value % 360) + 360) % 360;
}

export function createPageItemsFromDocuments(documents: Array<PdfDocumentState | UploadedPdfFile>) {
  return documents.flatMap((document) =>
    Array.from({ length: document.pageCount }, (_, pageIndex) => ({
      id: randomUUID(),
      sourceFileId: document.id,
      sourceFileName: document.name,
      sourceBaseName: document.baseName,
      sourcePageIndex: pageIndex,
      sourceBytes: document.bytes,
      rotation: 0,
    })),
  );
}

export function updatePageItemRotation(items: PdfPageItem[], pageId: string, delta: number) {
  return items.map((item) =>
    item.id === pageId
      ? { ...item, rotation: normalizeRotation(item.rotation + delta) }
      : item,
  );
}

export function updateAllPageRotations(items: PdfPageItem[], delta: number) {
  return items.map((item) => ({
    ...item,
    rotation: normalizeRotation(item.rotation + delta),
  }));
}

export function resetPageItemRotations(items: PdfPageItem[]) {
  return items.map((item) => ({ ...item, rotation: 0 }));
}

export function getPageItemsForSource(items: PdfPageItem[], sourceFileId: string) {
  return items.filter((item) => item.sourceFileId === sourceFileId);
}

export async function buildPdfFromPageItems(items: PdfPageItem[]) {
  try {
    const nextPdf = await PDFDocument.create();
    const sourceCache = new Map<string, PDFDocument>();

    for (const item of items) {
      let sourcePdf = sourceCache.get(item.sourceFileId);
      if (!sourcePdf) {
        sourcePdf = await PDFDocument.load(item.sourceBytes);
        sourceCache.set(item.sourceFileId, sourcePdf);
      }

      const [page] = await nextPdf.copyPages(sourcePdf, [item.sourcePageIndex]);
      if (item.rotation) {
        page.setRotation(degrees(item.rotation));
      }
      nextPdf.addPage(page);
    }

    return nextPdf.save();
  } catch (error) {
    throw new Error(getFriendlyPdfError(error));
  }
}
