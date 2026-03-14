import Image from "next/image";
import Link from "next/link";

const LOGO_URL = "https://files.catbox.moe/8buz43.png";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-white px-4 py-5 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">
      <div className="mx-auto max-w-6xl space-y-4 sm:px-6 lg:px-8">
        <ul className="flex flex-col gap-1.5 text-gray-700 dark:text-gray-300" aria-label="All in one tool features">
          <li className="flex items-center gap-2">
            <span className="text-primary" aria-hidden>✓</span>
            <span>All in one tool: merge, reorder, and split in one place.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary" aria-hidden>✓</span>
            <span>You can reorder when merging as well.</span>
          </li>
        </ul>
        <p>Fast, private PDF tools. No uploads, no servers, no tracking.</p>
        <Link href="/" className="mt-4 flex justify-center">
          <Image
            src={LOGO_URL}
            alt="PleaseFixMyPDF"
            width={80}
            height={80}
            className="h-20 w-20 object-contain"
            unoptimized
          />
        </Link>
      </div>
    </footer>
  );
}
