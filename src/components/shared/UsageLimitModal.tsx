"use client";

import Link from "next/link";

import { FREE_DAILY_LIMIT, hoursUntilReset } from "@/lib/usage";

interface UsageLimitModalProps {
  usedToday: number;
  limit?: number;
  onClose: () => void;
}

export function UsageLimitModal({
  usedToday,
  limit = FREE_DAILY_LIMIT,
  onClose,
}: UsageLimitModalProps) {
  if (usedToday < limit) return null;

  const hours = Math.ceil(hoursUntilReset());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="usage-limit-title"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl border border-border dark:border-gray-700">
        <h2 id="usage-limit-title" className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          You&apos;ve used all {limit} free operations today
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Upgrade to Pro for unlimited conversions, batch processing, OCR, and more.
        </p>
        <div className="space-y-3">
          <Link
            href="/pricing"
            className="block w-full bg-primary text-white text-center py-3 rounded-lg font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Go Pro — $4/month
          </Link>
          <Link
            href="/pricing#lifetime"
            className="block w-full border-2 border-primary text-primary text-center py-3 rounded-lg font-semibold hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Lifetime deal — $49.95 (one-time)
          </Link>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Your limit resets in {hours} {hours === 1 ? "hour" : "hours"}.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
