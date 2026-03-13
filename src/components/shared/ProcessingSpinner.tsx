import { Loader2 } from "lucide-react";

export function ProcessingSpinner({ label = "Processing..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-background px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/50">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-ink-muted dark:text-slate-300">
          Please wait while your PDF is processed in the browser.
        </p>
      </div>
    </div>
  );
}
