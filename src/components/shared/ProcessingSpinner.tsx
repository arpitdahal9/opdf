import { Loader2 } from "lucide-react";

export function ProcessingSpinner({ label = "Processing..." }: { label?: string }) {
  return (
    <div className="glass-panel flex flex-col items-center justify-center gap-3 border border-dashed border-white/12 px-6 py-10 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <div>
        <p className="font-semibold text-white">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Please wait while your PDF is processed in the browser.
        </p>
      </div>
    </div>
  );
}
