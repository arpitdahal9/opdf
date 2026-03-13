"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/layout/ThemeToggle";

const navItems = [
  { href: "/merge", label: "Merge" },
  { href: "/split", label: "Split" },
  { href: "/rotate", label: "Rotate" },
  { href: "/reorder", label: "Reorder" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-darkbg/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-primary">
          PDFKit
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary-soft text-primary"
                      : "text-ink-muted hover:text-primary dark:text-slate-300 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
