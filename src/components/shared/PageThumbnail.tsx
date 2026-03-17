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
  compact = false,
  hidePageBadge = false,
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
  /** Shorter min-height for use in collapsed/file cards */
  compact?: boolean;
  /** Hide the "Page N" badge (e.g. in compact/collapsed view) */
  hidePageBadge?: boolean;
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
          "group relative overflow-hidden rounded-lg border border-border bg-white shadow-sm transition-shadow",
          onClick && "cursor-pointer hover:shadow-md",
          selected
            ? "border-primary ring-2 ring-primary/20"
            : undefined,
        )}
      >
        <div className={cn("relative flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-[#0d132a] p-4", compact ? "min-h-[200px]" : "min-h-[320px]")}>
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
            <div className={cn("w-full animate-pulse rounded-lg bg-gray-200 dark:bg-white/10", compact ? "h-[180px]" : "h-[290px]")} />
          )}

          {selected ? (
            <div className="absolute right-2 top-2 rounded-full bg-white text-primary shadow">
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

          {!hidePageBadge ? (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-white">
              Page {pageIndex + 1}
            </div>
          ) : null}
        </div>
      </div>
      {children ? <div className="flex items-center justify-center gap-2">{children}</div> : null}
    </div>
  );
}
