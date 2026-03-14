import { PDFDocument, type PDFPage, StandardFonts } from "pdf-lib";

import { getFriendlyPdfError } from "@/lib/utils";

function sanitizeForWinAnsi(text: string) {
  // Replace characters outside the basic WinAnsi range with a placeholder.
  return text
    .split("")
    .map((char) => (char.charCodeAt(0) <= 0xff ? char : "?"))
    .join("");
}

export async function wordToPdf(wordBytes: Uint8Array): Promise<Uint8Array> {
  try {
    const { convertToHtml } = await import("mammoth/mammoth.browser");
    const arrayBuffer = wordBytes.buffer.slice(
      wordBytes.byteOffset,
      wordBytes.byteOffset + wordBytes.byteLength,
    ) as ArrayBuffer;

    const result = await convertToHtml({ arrayBuffer });
    const html = result.value;

    // Parse the Mammoth HTML so we can preserve some structure (headings, lists, paragraphs).
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    type BlockType = "paragraph" | "heading1" | "heading2" | "heading3" | "listItem";
    type Block = { type: BlockType; text: string };

    const blocks: Block[] = [];

    const pushBlock = (el: Element, type: BlockType) => {
      const textContent = sanitizeForWinAnsi((el.textContent ?? "").replace(/\s+/g, " ").trim());
      if (textContent) {
        blocks.push({ type, text: textContent });
      }
    };

    doc.body.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li").forEach((el) => {
      const tag = el.tagName.toLowerCase();

      if (tag === "h1") {
        pushBlock(el, "heading1");
      } else if (tag === "h2") {
        pushBlock(el, "heading2");
      } else if (tag === "h3") {
        pushBlock(el, "heading3");
      } else if (tag === "li") {
        pushBlock(el, "listItem");
      } else {
        pushBlock(el, "paragraph");
      }
    });

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const baseFontSize = 12;
    const baseLineHeight = baseFontSize * 1.3;
    const margin = 50;
    const pageWidth = 595.28; // A4 width in points
    const pageHeight = 841.89; // A4 height in points

    const addBlock = (page: PDFPage, block: Block, yStart: { value: number }) => {
      let fontSize = baseFontSize;
      let lineHeight = baseLineHeight;
      let indent = margin;
      let prefix = "";

      switch (block.type) {
        case "heading1":
          fontSize = 20;
          lineHeight = fontSize * 1.4;
          break;
        case "heading2":
          fontSize = 18;
          lineHeight = fontSize * 1.4;
          break;
        case "heading3":
          fontSize = 16;
          lineHeight = fontSize * 1.35;
          break;
        case "listItem":
          fontSize = baseFontSize;
          lineHeight = baseLineHeight;
          indent = margin + 20;
          prefix = "• ";
          break;
        default:
          fontSize = baseFontSize;
          lineHeight = baseLineHeight;
      }

      const maxLineWidth = pageWidth - indent - margin;

      const textContent = prefix ? `${prefix}${block.text}` : block.text;
      const words = textContent.split(/\s+/);
      let line = "";

      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        if (width > maxLineWidth && line) {
          if (yStart.value < margin + lineHeight) {
            // Start a new page.
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            yStart.value = pageHeight - margin;
          }
          page.drawText(line, {
            x: indent,
            y: yStart.value,
            size: fontSize,
            font,
          });
          yStart.value -= lineHeight;
          line = word;
        } else {
          line = testLine;
        }
      }

      if (line) {
        if (yStart.value < margin + lineHeight) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          yStart.value = pageHeight - margin;
        }
        page.drawText(line, {
          x: indent,
          y: yStart.value,
          size: fontSize,
          font,
        });
        // Extra space after headings and normal paragraphs.
        const spacingMultiplier =
          block.type === "heading1" || block.type === "heading2" ? 1.6 : 1.2;
        yStart.value -= lineHeight * spacingMultiplier;
      }
    };

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    const y = { value: pageHeight - margin };

    for (const block of blocks) {
      addBlock(page, block, y);
      if (y.value < margin + baseLineHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y.value = pageHeight - margin;
      } else {
        // Small additional gap between blocks to keep layout airy.
        y.value -= baseLineHeight * 0.4;
      }
    }

    return pdfDoc.save();
  } catch (error) {
    throw new Error(getFriendlyPdfError(error));
  }
}

