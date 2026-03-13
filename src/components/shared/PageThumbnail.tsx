"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

import { renderPdfPageThumbnail } from "@/lib/pdf/thumbnail";
import { cn } from "@/lib/utils";

export function PageThumbnail({
  pdfBytes,
  pageIndex,
  width = 240,
  onClick,
  selected = false,
  children,
  rotation = 0,
  badge,
  label,
  className,
}: {
  pdfBytes: Uint8Array;
  pageIndex: number;
  width?: number;
  onClick?: () => void;
  selected?: boolean;
  children?: React.ReactNode;
  rotation?: number;
  badge?: string;
  label?: string;
  className?: string;
}) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    renderPdfPageThumbnail(pdfBytes, pageIndex, width)
      .then((dataUrl) => {
        if (active) {
          setError(null);
          setThumbnailUrl(dataUrl);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Thumbnail preview unavailable.");
        }
      });

    return () => {
      active = false;
    };
  }, [pageIndex, pdfBytes, width]);

  return (
    <div className={cn("space-y-3", className)} style={{ width }}>
      <div
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(event) => {
          if (!onClick) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick();
          }
        }}
        className={cn(
          "group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 dark:bg-slate-900",
          onClick && "cursor-pointer hover:-translate-y-1 hover:shadow-card",
          selected
            ? "border-primary bg-primary-soft/70 ring-2 ring-primary/20 dark:bg-primary/10"
            : "border-border dark:border-slate-700",
        )}
      >
        <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-slate-100 p-4 dark:bg-slate-950/70">
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt={`Preview of page ${pageIndex + 1}`}
              className="h-auto max-w-full rounded-md shadow-sm transition-transform duration-200"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          ) : error ? (
            <div className="px-4 text-center text-xs text-danger">{error}</div>
          ) : (
            <div className="h-[290px] w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          )}

          {selected ? (
            <div className="absolute right-2 top-2 rounded-full bg-white text-primary shadow dark:bg-slate-900">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          ) : null}

          {badge ? (
            <div className="absolute left-2 top-2 rounded-full bg-slate-900/80 px-2 py-1 text-[11px] font-medium text-white">
              {badge}
            </div>
          ) : null}

          {label ? (
            <div className="absolute bottom-10 left-2 rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-white">
              {label}
            </div>
          ) : null}

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-white">
            Page {pageIndex + 1}
          </div>
        </div>
      </div>
      {children ? <div className="flex items-center justify-center gap-2">{children}</div> : null}
    </div>
  );
}
