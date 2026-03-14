import { PDFDocument } from "pdf-lib";

import { buildPdfFromPageItems } from "@/lib/pdf/page-editor";
import { getFriendlyPdfError } from "@/lib/utils";
import type { PdfPageItem } from "@/types/pdf";

export async function mergePDFs(pdfBytesArray: Uint8Array[]): Promise<Uint8Array> {
  try {
    const mergedPdf = await PDFDocument.create();
    for (const pdfBytes of pdfBytesArray) {
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }
    return mergedPdf.save();
  } catch (error) {
    throw new Error(getFriendlyPdfError(error));
  }
}

export async function mergeEditedPages(pageItems: PdfPageItem[]) {
  return buildPdfFromPageItems(pageItems);
}
