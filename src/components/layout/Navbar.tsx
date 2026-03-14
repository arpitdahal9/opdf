"use client";

import {
  FileText,
  Image as ImageIcon,
  Minimize2,
  type LucideIcon,
  RotateCw,
  Scissors,
  Workflow,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ThemeToggle } from "@/components/layout/ThemeToggle";

const redLinkHrefs = new Set(["/split", "/reorder", "/pdf-to-word", "/compress"]);
const blueLinkHrefs = new Set(["/merge", "/rotate", "/word-to-pdf", "/image-to-pdf"]);

const pdfTools: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/merge", label: "Merge PDF", icon: Workflow },
  { href: "/split", label: "Split PDF", icon: Scissors },
  { href: "/rotate", label: "Rotate PDF", icon: RotateCw },
];

const pdfConverter: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/word-to-pdf", label: "Word to PDF", icon: FileText },
  { href: "/pdf-to-word", label: "PDF to Word", icon: FileText },
  { href: "/compress", label: "Compress PDF", icon: Minimize2 },
  { href: "/image-to-pdf", label: "Image to PDF", icon: ImageIcon },
];

function DropdownItem({
  href,
  label,
  icon: Icon,
  pathname,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  pathname: string;
}) {
  const active = pathname === href;
  const isRed = redLinkHrefs.has(href);
  const isBlue = blueLinkHrefs.has(href);
  const accent = isRed ? "#DF232A" : isBlue ? "#169DCF" : "var(--primary)";

  return (
    <Link
      href={href}
      role="menuitem"
      className={`
        group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
        transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${active ? "bg-primary/10 dark:bg-primary/15" : "hover:bg-gray-100 dark:hover:bg-gray-800/80"}
      `}
      style={{
        borderLeft: `3px solid ${active ? accent : "transparent"}`,
        ...(active ? { color: accent } : {}),
      }}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors duration-200 group-hover:scale-105"
        style={{
          backgroundColor: active ? `${accent}18` : undefined,
          color: active ? accent : undefined,
        }}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <span className={active ? "font-semibold" : "text-gray-700 dark:text-gray-300"}>
        {label}
      </span>
    </Link>
  );
}

function Dropdown({
  label,
  items,
  pathname,
  open,
  onEnter,
  onLeave,
  dropdownId,
}: {
  label: string;
  items: { href: string; label: string; icon: LucideIcon }[];
  pathname: string;
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
  dropdownId: "tools" | "converter";
}) {
  return (
    <div
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <button
        type="button"
        className={`
          flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium
          transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
          ${open ? "text-gray-900 dark:text-white" : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"}
        `}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1.5 min-w-[220px] rounded-xl border border-border bg-white py-2 shadow-xl shadow-gray-200/50 dark:border-gray-700 dark:bg-gray-900 dark:shadow-black/20"
          role="menu"
        >
          <div className="px-2.5 pb-1.5 pt-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {dropdownId === "tools" ? "Edit & organize" : "Convert & compress"}
            </p>
          </div>
          <div className="space-y-0.5 px-2">
            {items.map((item) => (
              <DropdownItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                pathname={pathname}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<"tools" | "converter" | null>(null);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="relative flex h-12 w-12 items-center justify-center">
            <Image
              src="https://files.catbox.moe/8buz43.png"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
              unoptimized
            />
          </span>
          <span className="font-display text-4xl font-bold tracking-tight">
            <span className="text-[#169DCF] dark:text-[#3DB5E0]">Please</span>
            <span className="text-[#DF232A] dark:text-[#E84A50]">Fix</span>
            <span className="text-[#169DCF] dark:text-[#3DB5E0]">My</span>
            <span className="text-[#DF232A] dark:text-[#E84A50]">PDF</span>
            <span className="text-[#169DCF] dark:text-[#3DB5E0]">.com</span>
          </span>
        </Link>
        <nav className="flex min-w-0 flex-1 flex-nowrap items-center justify-end gap-1 overflow-visible">
          <Dropdown
            label="PDF Tools"
            items={pdfTools}
            pathname={pathname}
            open={openDropdown === "tools"}
            onEnter={() => setOpenDropdown("tools")}
            onLeave={() => setOpenDropdown(null)}
            dropdownId="tools"
          />
          <Dropdown
            label="PDF Converter"
            items={pdfConverter}
            pathname={pathname}
            open={openDropdown === "converter"}
            onEnter={() => setOpenDropdown("converter")}
            onLeave={() => setOpenDropdown(null)}
            dropdownId="converter"
          />
        </nav>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            href="/about"
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            About
          </Link>
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
