export type UploadedPdfFile = {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  bytes: Uint8Array;
};

export type PdfDocumentState = {
  file: File;
  name: string;
  size: number;
  pageCount: number;
  bytes: Uint8Array;
  baseName: string;
};
