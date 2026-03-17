let pdfJsTextPromise: Promise<typeof import("pdfjs-dist/legacy/build/pdf.mjs")> | null = null;
const textWorkerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

async function getPdfJsForText() {
  if (!pdfJsTextPromise) {
    pdfJsTextPromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = textWorkerSrc;
      return pdfjs;
    });
  }
  return pdfJsTextPromise;
}

export async function extractTextFromPdf(pdfBytes: Uint8Array): Promise<string> {
  const pdfjs = await getPdfJsForText();
  const { getDocument } = pdfjs;
  const pdf = await getDocument({ data: pdfBytes.slice(0) }).promise;

  const parts: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const strings = content.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => ("str" in item ? item.str : ""))
      .filter(Boolean);
    parts.push(strings.join(" "));
  }

  await pdf.destroy();
  return parts.join("\n\n");
}

