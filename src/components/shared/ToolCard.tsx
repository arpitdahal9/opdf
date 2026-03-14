import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

export function ToolCard({
  href,
  title,
  description,
  icon: Icon,
  accent,
}: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent?: "blue" | "red";
}) {
  const ringClass =
    accent === "blue"
      ? "focus-visible:ring-toolBlue"
      : accent === "red"
        ? "focus-visible:ring-toolRed"
        : "focus-visible:ring-primary";
  const iconClass =
    accent === "blue"
      ? "bg-toolBlue/10 text-toolBlue"
      : accent === "red"
        ? "bg-toolRed/10 text-toolRed"
        : "bg-primary/10 text-primary";
  const openClass =
    accent === "blue"
      ? "text-toolBlue"
      : accent === "red"
        ? "text-toolRed"
        : "text-primary";
  return (
    <Link
      href={href}
      className={`card-surface group flex h-full flex-col gap-3 p-4 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:p-5 ${ringClass}`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <div className={`mt-auto inline-flex items-center gap-1 text-sm font-medium ${openClass}`}>
        Open
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
