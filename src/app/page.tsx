import { ArrowUpDown, Lock, RotateCw, Scissors, Workflow } from "lucide-react";

import { ToolCard } from "@/components/shared/ToolCard";

const tools = [
  {
    href: "/merge",
    title: "Merge PDF",
    description: "Combine multiple PDFs into one clean document in the exact order you want.",
    icon: Workflow,
  },
  {
    href: "/split",
    title: "Split PDF",
    description: "Extract the exact pages you need with page picking or flexible ranges.",
    icon: Scissors,
  },
  {
    href: "/rotate",
    title: "Rotate PDF",
    description: "Rotate one page or every page with instant visual previews before download.",
    icon: RotateCw,
  },
  {
    href: "/reorder",
    title: "Reorder PDF",
    description: "Drag pages into a new sequence and save a reorganized PDF in seconds.",
    icon: ArrowUpDown,
  },
];

export default function HomePage() {
  return (
    <div className="page-wrap animate-fadeIn">
      <section className="mx-auto max-w-3xl py-10 text-center sm:py-16">
        <span className="inline-flex rounded-full bg-primary-soft px-4 py-2 text-sm font-medium text-primary dark:bg-primary/15">
          100% browser-based PDF toolkit
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Fast, Private PDF Tools
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-ink-muted dark:text-slate-300 sm:text-lg">
          Merge, split, rotate, and reorder PDFs without uploads or servers. Your files stay on your device from start to finish.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </section>

      <section className="card-surface mx-auto mt-8 flex max-w-3xl items-start gap-4 p-5 sm:items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary dark:bg-primary/15">
          <Lock className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Private by design</h2>
          <p className="mt-1 text-sm text-ink-muted dark:text-slate-300">
            Every PDF is processed entirely in your browser. Nothing is ever uploaded to a server.
          </p>
        </div>
      </section>
    </div>
  );
}
