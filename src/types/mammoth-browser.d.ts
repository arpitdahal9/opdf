declare module "mammoth/mammoth.browser" {
  export type MammothResult = {
    value: string;
    messages: { type: string; message: string }[];
  };

  export function convertToHtml(options: {
    arrayBuffer: ArrayBuffer;
  }): Promise<MammothResult>;
}

