"use client";

import { useState } from "react";
import QRCode from "qrcode";

import { downloadBytes } from "@/lib/utils";

type EcLevel = "L" | "M" | "Q" | "H";

export function QrCodeGeneratorTool() {
  const [value, setValue] = useState("");
  const [size, setSize] = useState<number>(256);
  const [ecLevel, setEcLevel] = useState<EcLevel>("M");

  const [error, setError] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  async function regenerate(nextValue: string, nextSize: number, nextEc: EcLevel) {
    const trimmed = nextValue.trim();
    if (!trimmed) {
      setQrDataUrl(null);
      return;
    }
    try {
      const url = await QRCode.toDataURL(trimmed, {
        width: Math.max(128, Math.min(1024, Math.trunc(nextSize))),
        margin: 2,
        errorCorrectionLevel: nextEc,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrDataUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to generate QR code.");
      setQrDataUrl(null);
    }
  }

  async function downloadPng() {
    const dataUrl = qrDataUrl;
    if (!dataUrl) return;
    const base64 = dataUrl.split(",")[1] ?? "";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    downloadBytes(bytes, "qr-code.png", "image/png");
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}
      <div className="grid gap-4 rounded-xl border border-border bg-white p-5 dark:bg-gray-900 dark:border-gray-700">
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-gray-900 dark:text-white">Text or URL</span>
          <input
            className="field-input"
            value={value}
            onChange={(e) => {
              setError(null);
              const next = e.target.value;
              setValue(next);
              void regenerate(next, size, ecLevel);
            }}
            placeholder="Enter text or a URL"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-gray-900 dark:text-white">Size (px)</span>
            <input
              type="number"
              min={128}
              max={1024}
              className="field-input"
              value={size}
              onChange={(e) => {
                setError(null);
                const next = Number(e.target.value);
                setSize(next);
                void regenerate(value, next, ecLevel);
              }}
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-gray-900 dark:text-white">Error correction</span>
            <select
              className="field-input"
              value={ecLevel}
              onChange={(e) => {
                setError(null);
                const next = e.target.value as EcLevel;
                setEcLevel(next);
                void regenerate(value, size, next);
              }}
            >
              <option value="L">L (small)</option>
              <option value="M">M (default)</option>
              <option value="Q">Q</option>
              <option value="H">H (high)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 dark:bg-gray-900 dark:border-gray-700">
        {qrDataUrl ? (
          <div className="flex flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl as unknown as string}
              alt="Generated QR code"
              className="h-auto w-auto"
              style={{ maxWidth: 360 }}
            />
            <button type="button" className="primary-button" onClick={() => void downloadPng()}>
              Download PNG
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter some text to generate a QR code.
          </p>
        )}
      </div>
    </div>
  );
}

