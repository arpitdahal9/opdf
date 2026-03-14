import { Document, Packer, Paragraph } from "docx";

import { getFriendlyPdfError } from "@/lib/utils";

const workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

async function getPdfJs() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const { GlobalWorkerOptions } = pdfjs;
  if (!GlobalWorkerOptions.workerSrc) {
    GlobalWorkerOptions.workerSrc = workerSrc;
  }
  return pdfjs;
}

export async function pdfToWord(pdfBytes: Uint8Array): Promise<Uint8Array> {
  try {
    const pdfjs = await getPdfJs();
    const { getDocument } = pdfjs;

    const loadingTask = getDocument({ data: pdfBytes });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;

    const paragraphs: Paragraph[] = [];

    for (let pageIndex = 1; pageIndex <= pageCount; pageIndex += 1) {
      const page = await pdf.getPage(pageIndex);
      const textContent = await page.getTextContent();

      const items = textContent.items as Array<{ str: string; transform: number[] }>;

      // Group by approximate line (y-coordinate).
      const linesMap = new Map<number, string[]>();
      for (const item of items) {
        const y = item.transform[5]; // approximate vertical pos
        const roundedY = Math.round(y / 5) * 5;
        const line = linesMap.get(roundedY) ?? [];
        line.push(item.str);
        linesMap.set(roundedY, line);
      }

      const sortedLines = Array.from(linesMap.entries())
        .sort((a, b) => b[0] - a[0])
        .map(([, parts]) => parts.join(" ").trim())
        .filter(Boolean);

      if (pageIndex > 1) {
        paragraphs.push(new Paragraph("")); // visual break between pages
      }

      for (const line of sortedLines) {
        paragraphs.push(new Paragraph(line));
      }
    }

    await pdf.destroy();

    const doc = new Document({
      sections: [
        {
          children: paragraphs.length ? paragraphs : [new Paragraph(" ")],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const arrayBuffer = await blob.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    throw new Error(getFriendlyPdfError(error));
  }
}

