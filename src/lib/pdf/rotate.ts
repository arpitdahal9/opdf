import { PDFDocument, degrees } from "pdf-lib";

import { getFriendlyPdfError } from "@/lib/utils";

export async function rotatePDF(
  pdfBytes: Uint8Array,
  rotations: Map<number, number>,
): Promise<Uint8Array> {
  try {
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = pdf.getPages();
    rotations.forEach((deg, idx) => {
      const page = pages[idx];
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + deg + 360) % 360));
    });
    return pdf.save();
  } catch (error) {
    throw new Error(getFriendlyPdfError(error));
  }
}
