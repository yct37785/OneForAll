/**
 * Formats a Unix timestamp using the device's local timezone.
 * 
 * @param timestampMs - unix timestamp
 * 
 * @returns example 10-08-2026 23:04:17
 */
export function formatDateTime(timestampMs: number): string {
  const date = new Date(timestampMs);

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
 * @param durationMs - duration in ms
 * 
 * @returns example 7h 32m
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
 * @param timestampMs - unix timestamp
 * 
 * @returns example 21:30
 */
export function formatHour(timestampMs: number): string {
  const date = new Date(timestampMs);
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${hour}:${minute}`;
}

/**
 * Formats a timestamp as month YYYY in local time.
 * 
 * @param timestampMs - unix timestamp
 * 
 * @returns example October 2026
 */
export function getMonthLabel(timestampMs: number): string {
  return new Date(timestampMs).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

/**
 * Checks if given dates are part of the same Sun-Sat defined week.
 * 
 * @param date1 - first date to compare
 * @param date2 - second date to compare
 * 
 * @returns true if same week, false otherwise
 */
export function isSameWeek(date1: Date, date2: Date) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  const sunday1 = d1.setDate(d1.getDate() - d1.getDay());
  const sunday2 = d2.setDate(d2.getDate() - d2.getDay());
  return sunday1 === sunday2;
}
