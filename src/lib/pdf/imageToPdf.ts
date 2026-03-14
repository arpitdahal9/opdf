import { PDFDocument } from "pdf-lib";

export type ImagePageSize = "fit-to-image" | "a4-portrait" | "a4-landscape";

export type ImageSource = {
  bytes: Uint8Array;
  mimeType: string;
};

const A4_PORTRAIT = {
  width: 595.28,
  height: 841.89,
};

const A4_LANDSCAPE = {
  width: A4_PORTRAIT.height,
  height: A4_PORTRAIT.width,
};

function getPageSize(option: ImagePageSize, imageWidth: number, imageHeight: number) {
  if (option === "a4-portrait") return A4_PORTRAIT;
  if (option === "a4-landscape") return A4_LANDSCAPE;
  return { width: imageWidth, height: imageHeight };
}

/** Convert WebP/GIF (or any browser-decodable image) to PNG via canvas. Use in browser only. */
async function imageBytesToPngInBrowser(bytes: Uint8Array, mimeType: string): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([bytes as BlobPart], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (pngBlob) => {
            URL.revokeObjectURL(url);
            if (!pngBlob) {
              reject(new Error("Failed to encode image as PNG"));
              return;
            }
            pngBlob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)));
          },
          "image/png",
          1,
        );
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image failed to load"));
    };
    img.src = url;
  });
}

function needsPngConversion(mimeType: string): boolean {
  const t = mimeType.toLowerCase();
  return t === "image/webp" || t === "image/gif";
}

export async function imagesToPdf(
  images: ImageSource[],
  pageSize: ImagePageSize = "fit-to-image",
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const image of images) {
    let bytes = image.bytes;
    let mimeType = image.mimeType;

    if (typeof document !== "undefined" && needsPngConversion(mimeType)) {
      bytes = await imageBytesToPngInBrowser(bytes, mimeType);
      mimeType = "image/png";
    }

    const isJpeg =
      mimeType === "image/jpeg" ||
      mimeType === "image/jpg" ||
      mimeType === "image/pjpeg";

    const embedded = isJpeg
      ? await pdfDoc.embedJpg(bytes)
      : await pdfDoc.embedPng(bytes);

    const targetSize = getPageSize(pageSize, embedded.width, embedded.height);
    const page = pdfDoc.addPage([targetSize.width, targetSize.height]);

    const scale = Math.min(targetSize.width / embedded.width, targetSize.height / embedded.height);
    const drawWidth = embedded.width * scale;
    const drawHeight = embedded.height * scale;
    const x = (targetSize.width - drawWidth) / 2;
    const y = (targetSize.height - drawHeight) / 2;

    page.drawImage(embedded, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });
  }

  return pdfDoc.save();
}

