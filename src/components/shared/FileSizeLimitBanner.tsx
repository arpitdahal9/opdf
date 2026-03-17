"use client";

import Link from "next/link";

export function FileSizeLimitBanner({ fileSizeMB }: { fileSizeMB: number }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-800 dark:bg-amber-950/30">
      <p className="font-medium text-amber-800 dark:text-amber-200">
        Your file is {fileSizeMB.toFixed(1)}MB — free accounts support files up to 10MB.
      </p>
      <p className="mt-1 text-amber-700 dark:text-amber-300">
        <Link href="/pricing" className="underline font-semibold hover:no-underline">
          Pro
        </Link>{" "}
        handles files up to 100MB.
      </p>
    </div>
  );
}
