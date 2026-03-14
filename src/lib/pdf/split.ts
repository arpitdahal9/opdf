import { PDFDocument } from "pdf-lib";

import { buildPdfFromPageItems } from "@/lib/pdf/page-editor";
import { getFriendlyPdfError } from "@/lib/utils";
import type { PdfPageItem } from "@/types/pdf";

export async function splitPDF(
  pdfBytes: Uint8Array,
  pageIndices: number[],
): Promise<Uint8Array> {
  try {
    const srcPdf = await PDFDocument.load(pdfBytes);
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(srcPdf, pageIndices);
    pages.forEach((page) => newPdf.addPage(page));
    return newPdf.save();
  } catch (error) {
    throw new Error(getFriendlyPdfError(error));
  }
}

export async function splitEditedPages(pageItems: PdfPageItem[]) {
  return buildPdfFromPageItems(pageItems);
}
