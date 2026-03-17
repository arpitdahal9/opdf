/**
 * Client-side usage tracking for freemium limits.
 * Persists daily count, total operations, and tools used (localStorage).
 */

const STORAGE_KEY = "pfmpdf_usage";

export interface UsageData {
  dailyCount: number;
  date: string;
  totalAllTime: number;
  toolsUsed: string[];
}

function getToday(): string {
  return new Date().toISOString().split("T")[0]!;
}

export function getUsage(): UsageData {
  if (typeof window === "undefined") {
    return { dailyCount: 0, date: getToday(), totalAllTime: 0, toolsUsed: [] };
  }
  const today = getToday();
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<UsageData>;
  if (stored.date !== today) {
    return {
      dailyCount: 0,
      date: today,
      totalAllTime: stored.totalAllTime ?? 0,
      toolsUsed: stored.toolsUsed ?? [],
    };
  }
  return {
    dailyCount: stored.dailyCount ?? 0,
    date: today,
    totalAllTime: stored.totalAllTime ?? 0,
    toolsUsed: stored.toolsUsed ?? [],
  };
}

export function trackUsage(toolSlug: string): UsageData {
  const today = getToday();
  const stored = getUsage();
  if (stored.date !== today) {
    stored.dailyCount = 0;
    stored.date = today;
  }
  stored.dailyCount = (stored.dailyCount ?? 0) + 1;
  stored.totalAllTime = (stored.totalAllTime ?? 0) + 1;
  stored.toolsUsed = [...new Set([...(stored.toolsUsed ?? []), toolSlug])];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }
  return stored;
}

/** Free tier: max operations per day (no account). */
export const FREE_DAILY_LIMIT = 5;

/** Free tier: max file size in bytes (10MB). */
export const FREE_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/** Return whether the user has hit their daily free limit. */
export function hasReachedDailyLimit(): boolean {
  const u = getUsage();
  return u.dailyCount >= FREE_DAILY_LIMIT;
}

/** Hours until midnight (for "limit resets in X hours" copy). */
export function hoursUntilReset(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(0, (midnight.getTime() - now.getTime()) / (1000 * 60 * 60));
}
