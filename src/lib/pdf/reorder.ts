import { PDFDocument } from "pdf-lib";

import { getFriendlyPdfError } from "@/lib/utils";

export async function reorderPDF(
  pdfBytes: Uint8Array,
  newOrder: number[],
): Promise<Uint8Array> {
  try {
    const srcPdf = await PDFDocument.load(pdfBytes);
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(srcPdf, newOrder);
    pages.forEach((page) => newPdf.addPage(page));
    return newPdf.save();
  } catch (error) {
    throw new Error(getFriendlyPdfError(error));
  }
}
