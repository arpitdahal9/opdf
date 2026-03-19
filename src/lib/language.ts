import { useSyncExternalStore } from "react";

export type LanguageCode = "en" | "hi" | "ne" | "zh";

const LANG_STORAGE_KEY = "pfmpdf_lang";

let currentLanguage: LanguageCode = "en";
const listeners = new Set<() => void>();

function isLanguageCode(value: unknown): value is LanguageCode {
  return value === "en" || value === "hi" || value === "ne" || value === "zh";
}

export function getLanguage(): LanguageCode {
  if (typeof window === "undefined") return currentLanguage;
  const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
  if (isLanguageCode(saved)) return saved;
  return currentLanguage;
}

export function setLanguage(next: LanguageCode) {
  currentLanguage = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LANG_STORAGE_KEY, next);
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useLanguage(): LanguageCode {
  return useSyncExternalStore(subscribe, getLanguage, () => currentLanguage);
}

