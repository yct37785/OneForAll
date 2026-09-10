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