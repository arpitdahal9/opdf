"use client";

import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-background text-ink dark:bg-darkbg dark:text-darkink">
        <main className="page-wrap flex min-h-screen items-center justify-center">
          <div className="card-surface max-w-lg p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
            <p className="mt-3 text-sm text-ink-muted dark:text-slate-300">
              {error.message || "An unexpected error occurred while loading the app."}
            </p>
            <button className="primary-button mt-6" onClick={() => reset()}>
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
