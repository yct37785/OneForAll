/**
 * Safely trim any input into a string:
 * - protects against undefined/null from upstream changes
 * - collapses weird whitespace around the payload
 */
export const safeTrim = (v: unknown): string => {
  return String(v ?? '').trim();
};

/**
 * Basic HTTP/HTTPS URL detection:
 * - avoids throwing on URL()
 * - intentionally conservative; only accepts http(s)
 */
export const isHttpUrl = (s: string): boolean => {
  return /^https?:\/\/\S+$/i.test(s);
};

/**
 * Very lightweight "phone-ish" detection for plain text payloads:
 * - accepts +, digits, spaces, dashes, parentheses
 * - requires a minimum length to avoid false positives
 */
export const isProbablyPhone = (s: string): boolean => {
  return /^\+?[0-9][0-9\s\-()]{5,}$/.test(s);
};

/**
 * Convert a phone-ish string into a cleaner version:
 * - keeps leading "+"
 * - strips spaces/dashes/parentheses for tel: usage
 */
export const normalizePhone = (s: string): string => {
  const trimmed = safeTrim(s);
  const keepPlus = trimmed.startsWith('+');
  const digitsOnly = trimmed.replace(/[^\d]/g, '');
  return keepPlus ? `+${digitsOnly}` : digitsOnly;
};

/**
 * Formats a Unix timestamp using the device's local timezone.
 * Sample output: 10-08-2026 23:04:17
 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Formats milliseconds as a compact duration.
 *
 * Eg. 7h 32m
 */
export function formatDuration(durationMs: number): string {
  const totalMinutes = Math.floor(durationMs / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

/**
 * Formats a timestamp as HH:MM in 24-hour local time.
 *
 * Example:
 * 21:30
 */
export function formatHour(timestampMs: number): string {
  const date = new Date(timestampMs);
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${hour}:${minute}`;
}

/**
 * Validate values
 */
export const isNonEmptyString = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0;

export const isNonEmptyStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === 'string');

export function isNonEmptyValue<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function isNonEmptyArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0;
}