export type UploadedPdfFile = {
  id: string;
  file: File;
  name: string;
  baseName: string;
  size: number;
  pageCount: number;
  bytes: Uint8Array;
};

export type PdfDocumentState = {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  bytes: Uint8Array;
  baseName: string;
};

export type PdfPageItem = {
  id: string;
  sourceFileId: string;
  sourceFileName: string;
  sourceBaseName: string;
  sourcePageIndex: number;
  sourceBytes: Uint8Array;
  rotation: number;
};
