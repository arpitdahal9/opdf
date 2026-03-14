import { PDFDocument } from "pdf-lib";

import { getFriendlyPdfError } from "@/lib/utils";

export type CompressionLevel = "low" | "medium" | "high";

export async function compressPdf(
  pdfBytes: Uint8Array,
  compressionLevel: CompressionLevel = "medium",
): Promise<Uint8Array> {
  try {
    const srcPdf = await PDFDocument.load(pdfBytes);

    // Strip metadata
    srcPdf.setTitle("");
    srcPdf.setAuthor("");
    srcPdf.setSubject("");
    srcPdf.setKeywords([]);
    srcPdf.setProducer("");
    srcPdf.setCreator("Please Fix My PDF");

    // In future we could downsample images based on compressionLevel.
    // For now we rely on pdf-lib's built-in compression.

    const useObjectStreams = compressionLevel !== "low";
    return srcPdf.save({ useObjectStreams });
  } catch (error) {
    throw new Error(getFriendlyPdfError(error));
  }
}

