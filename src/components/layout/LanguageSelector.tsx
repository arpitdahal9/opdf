"use client";

import { useEffect } from "react";

import { t } from "@/lib/i18n";
import { setLanguage, useLanguage, type LanguageCode } from "@/lib/language";

type LangOption = {
  code: LanguageCode;
  label: string;
  htmlLang: string;
};

const LANG_OPTIONS: LangOption[] = [
  { code: "en", label: "English", htmlLang: "en" },
  { code: "hi", label: "हिन्दी", htmlLang: "hi-IN" },
  { code: "ne", label: "नेपाली", htmlLang: "ne-NP" },
  { code: "zh", label: "中文", htmlLang: "zh-CN" },
];

export function LanguageSelector() {
  const lang = useLanguage();

  useEffect(() => {
    const option = LANG_OPTIONS.find((o) => o.code === lang);
    if (!option) return;
    document.documentElement.lang = option.htmlLang;
  }, [lang]);

  return (
    <div className="flex items-center justify-center gap-3 text-xs text-gray-600 dark:text-gray-400">
      <span className="whitespace-nowrap">{t(lang, "language")}</span>
      <select
        value={lang}
        onChange={(e) => setLanguage(e.target.value as LanguageCode)}
        className="rounded-md border border-border bg-white px-2 py-1 text-xs text-gray-700 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Select language"
      >
        {LANG_OPTIONS.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

