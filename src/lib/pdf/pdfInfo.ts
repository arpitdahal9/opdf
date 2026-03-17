/**
 * Read PDF page count and metadata using pdf-lib (no rendering).
 */

import { PDFDocument } from "pdf-lib";

export async function getPageCount(pdfBytes: Uint8Array): Promise<number> {
  const pdf = await PDFDocument.load(pdfBytes, { updateMetadata: false });
  return pdf.getPageCount();
}

export interface PdfMetadata {
  pageCount: number;
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  keywords?: string;
  creationDate?: Date | string;
  modificationDate?: Date | string;
}

export async function getPdfMetadata(pdfBytes: Uint8Array): Promise<PdfMetadata> {
  const pdf = await PDFDocument.load(pdfBytes, { updateMetadata: false });
  const creation = pdf.getCreationDate();
  const modification = pdf.getModificationDate();
  return {
    pageCount: pdf.getPageCount(),
    title: pdf.getTitle() ?? undefined,
    author: pdf.getAuthor() ?? undefined,
    subject: pdf.getSubject() ?? undefined,
    creator: pdf.getCreator() ?? undefined,
    producer: pdf.getProducer() ?? undefined,
    keywords: pdf.getKeywords() ?? undefined,
    creationDate: creation != null ? (typeof creation === "string" ? creation : new Date(creation as unknown as number)) : undefined,
    modificationDate: modification != null ? (typeof modification === "string" ? modification : new Date(modification as unknown as number)) : undefined,
  };
}
