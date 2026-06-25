// Per-browser daily limit for WhatsApp cake enquiries (no auth on the frontend, so the
// "user" is the device/browser). Resets automatically each calendar day.

export const DAILY_ENQUIRY_LIMIT = 10;

const STORAGE_KEY = "chocobee-enquiry-limit";

type LimitRecord = { date: string; count: number };

function todayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readRecord(): LimitRecord {
  const fallback: LimitRecord = { date: todayKey(), count: 0 };
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<LimitRecord>;
    if (parsed && parsed.date === todayKey() && typeof parsed.count === "number") {
      return { date: parsed.date, count: parsed.count };
    }
  } catch {
    // ignore unreadable storage — treat as a fresh day
  }

  return fallback;
}

/** Number of enquiries already sent today from this browser. */
export function getEnquiryCount(): number {
  return readRecord().count;
}

/** True when today's enquiry quota has been used up. */
export function hasReachedEnquiryLimit(): boolean {
  return readRecord().count >= DAILY_ENQUIRY_LIMIT;
}

/** Record one enquiry for today and return the new count. */
export function recordEnquiry(): number {
  const current = readRecord();
  const next: LimitRecord = { date: todayKey(), count: current.count + 1 };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore unwritable storage
    }
  }

  return next.count;
}
