"use client";

import { formatDurationMs, formatFileSize } from "@/lib/utils";

export function ProcessingResultStats({
  beforeSize,
  afterSize,
  pageCount,
  processingTimeMs,
  reductionPercent,
  afterLabel = "Result",
}: {
  beforeSize?: number | null;
  afterSize?: number | null;
  pageCount?: number | null;
  processingTimeMs?: number | null;
  reductionPercent?: number | null;
  afterLabel?: string;
}) {
  const hasBefore = beforeSize != null && beforeSize >= 0;
  const hasAfter = afterSize != null && afterSize >= 0;

  return (
    <div className="glass-panel flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
      <div className="space-y-1">
        <p className="font-semibold text-white">Processing stats</p>
        <p className="text-ink-muted">
          {hasBefore ? `Original: ${formatFileSize(beforeSize as number)}` : null}
          {hasBefore && hasAfter ? " · " : null}
          {hasAfter ? `${afterLabel}: ${formatFileSize(afterSize as number)}` : null}
        </p>
        {pageCount != null ? (
          <p className="text-xs text-ink-muted">
            {pageCount} page{pageCount === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col items-end gap-1">
        {processingTimeMs != null ? (
          <p className="text-sm font-semibold text-emerald-400">
            Processed in {formatDurationMs(processingTimeMs)}
          </p>
        ) : null}
        {reductionPercent != null ? (
          <p className="text-sm font-semibold text-emerald-300">Reduced by {reductionPercent}%</p>
        ) : null}
      </div>
    </div>
  );
}

