"use client";

import Link from "next/link";

import { allConversions, allTools } from "@/lib/content";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/lib/language";

export function Footer() {
  const lang = useLanguage();
  return (
    <footer className="mt-auto border-t border-border bg-white px-4 py-8 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t(lang, "footerPdfTools")}</h3>
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
                  {t(lang, "allTools")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t(lang, "footerConvert")}</h3>
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
                  {t(lang, "converterHub")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t(lang, "footerCompany")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">{t(lang, "about")}</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">{t(lang, "pricing")}</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">{t(lang, "blog")}</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">{t(lang, "privacyPolicy")}</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">{t(lang, "termsOfService")}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t(lang, "footerCompare")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/compare/pleasefixmypdf-vs-ilovepdf" className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">{t(lang, "vsILovePDF")}</Link>
              </li>
              <li>
                <Link href="/compare/pleasefixmypdf-vs-smallpdf" className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">{t(lang, "vsSmallPDF")}</Link>
              </li>
              <li>
                <Link href="/alternatives/ilovepdf-alternatives" className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">{t(lang, "ilovepdfAlternatives")}</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <LanguageSelector />
        </div>
        <p className="mt-4 text-center text-gray-500 dark:text-gray-500">PleaseFixMyPDF</p>
      </div>
    </footer>
  );
}
