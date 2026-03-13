let pdfJsPromise: Promise<typeof import("pdfjs-dist/legacy/build/pdf.mjs")> | null = null;
const thumbnailCache = new Map<string, Promise<string>>();
const workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url).toString();

async function getPdfJs() {
  if (!pdfJsPromise) {
    pdfJsPromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
      return pdfjs;
    });
  }

  return pdfJsPromise;
}

function getCacheKey(pdfBytes: Uint8Array, pageIndex: number, width: number) {
  const first = pdfBytes[0] ?? 0;
  const last = pdfBytes[pdfBytes.length - 1] ?? 0;
  return `${pdfBytes.length}-${first}-${last}-${pageIndex}-${width}`;
}

export async function renderPdfPageThumbnail(
  pdfBytes: Uint8Array,
  pageIndex: number,
  width = 240,
) {
  const cacheKey = getCacheKey(pdfBytes, pageIndex, width);
  if (!thumbnailCache.has(cacheKey)) {
    thumbnailCache.set(
      cacheKey,
      (async () => {
        const pdfjs = await getPdfJs();
        const { getDocument } = pdfjs;
        const pdf = await getDocument({ data: pdfBytes.slice(0) }).promise;
        const page = await pdf.getPage(pageIndex + 1);
        const viewport = page.getViewport({ scale: 1 });
        const scale = width / viewport.width;
        const scaledViewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas rendering is not available in this browser.");
        }

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        await page.render({ canvas, canvasContext: context, viewport: scaledViewport }).promise;
        const dataUrl = canvas.toDataURL("image/png");
        page.cleanup();
        await pdf.destroy();
        return dataUrl;
      })(),
    );
  }

  return thumbnailCache.get(cacheKey)!;
}
