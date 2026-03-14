"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/layout/ThemeToggle";

const redLinkHrefs = new Set(["/split", "/reorder", "/pdf-to-word", "/compress"]);
const blueLinkHrefs = new Set(["/merge", "/rotate", "/word-to-pdf", "/image-to-pdf"]);

const navItems = [
  { href: "/merge", label: "Merge PDF" },
  { href: "/split", label: "Split PDF" },
  { href: "/rotate", label: "Rotate PDF" },
  { href: "/reorder", label: "Reorder PDF" },
  { href: "/word-to-pdf", label: "Word to PDF" },
  { href: "/pdf-to-word", label: "PDF to Word" },
  { href: "/compress", label: "Compress PDF" },
  { href: "/image-to-pdf", label: "Image to PDF" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <span className="relative flex h-12 w-12 items-center justify-center">
            <Image
              src="https://files.catbox.moe/8buz43.png"
              alt="PleaseFixMyPDF"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
              unoptimized
            />
          </span>
        </Link>
        <nav className="flex min-w-0 flex-1 flex-nowrap items-center justify-end gap-0.5 overflow-visible">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const isRed = redLinkHrefs.has(item.href);
            const isBlue = blueLinkHrefs.has(item.href);
            const base =
              "whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ";
            let activeClass: string;
            if (active) {
              activeClass = isRed
                ? "text-[#DF232A] dark:text-[#E84A50]"
                : isBlue
                  ? "text-[#169DCF] dark:text-[#3DB5E0]"
                  : "text-primary";
            } else {
              activeClass = isRed
                ? "text-[#DF232A] hover:text-[#C01E24] dark:text-[#E84A50] dark:hover:text-[#F06B70]"
                : isBlue
                  ? "text-[#169DCF] hover:text-[#1282B0] dark:text-[#3DB5E0] dark:hover:text-[#5FC4E8]"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white";
            }
            return (
              <Link key={item.href} href={item.href} className={base + activeClass}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            href="/#tools"
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            All tools
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
