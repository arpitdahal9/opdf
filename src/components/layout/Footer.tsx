import Link from "next/link";

import { allConversions, allTools } from "@/lib/content";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-white px-4 py-8 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">
      <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">PDF tools</h3>
            <ul className="space-y-2">
              {allTools.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={t.path}
                    className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tools"
                  className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                >
                  All tools
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Convert</h3>
            <ul className="space-y-2">
              {allConversions.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={c.path}
                    className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/converter"
                  className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                >
                  Converter hub
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">About</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">Pricing</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">Blog</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Compare</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/compare/pleasefixmypdf-vs-ilovepdf" className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">vs iLovePDF</Link>
              </li>
              <li>
                <Link href="/compare/pleasefixmypdf-vs-smallpdf" className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">vs SmallPDF</Link>
              </li>
              <li>
                <Link href="/alternatives/ilovepdf-alternatives" className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">iLovePDF alternatives</Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center text-gray-500 dark:text-gray-500">PleaseFixMyPDF</p>
      </div>
    </footer>
  );
}
