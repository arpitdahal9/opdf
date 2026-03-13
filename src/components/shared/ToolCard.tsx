import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

export function ToolCard({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="card-surface group flex h-full flex-col gap-4 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-card"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary dark:bg-primary/15">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-ink-muted dark:text-slate-300">{description}</p>
      </div>
      <div className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary">
        Open tool
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
