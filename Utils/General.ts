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
