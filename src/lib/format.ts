/**
 * Pure formatting + small computation helpers shared across widgets.
 * All functions are deterministic and unit-tested.
 */

export type DeltaDirection = 'up' | 'down' | 'flat';

export interface DeltaResult {
  /** Signed percentage change vs the previous value, rounded to 1 dp. */
  pct: number;
  /** Direction of the raw value change. */
  direction: DeltaDirection;
  /** Whether the change is "good", accounting for metric polarity. */
  isImprovement: boolean;
}

/**
 * Compute the change between a current and previous value.
 *
 * `lowerIsBetter` flips the polarity: for response/resolution times a decrease
 * is an improvement; for users/reports an increase is an improvement.
 */
export function computeDelta(
  current: number,
  previous: number,
  lowerIsBetter = false,
): DeltaResult {
  const rawDiff = current - previous;
  const pct = previous === 0 ? 0 : Math.round((rawDiff / Math.abs(previous)) * 1000) / 10;

  let direction: DeltaDirection = 'flat';
  if (rawDiff > 0) direction = 'up';
  else if (rawDiff < 0) direction = 'down';

  const isImprovement =
    direction === 'flat' ? false : lowerIsBetter ? direction === 'down' : direction === 'up';

  return { pct, direction, isImprovement };
}

/** Format a signed percentage for a delta badge, e.g. `4.2%` (sign handled by caller/arrow). */
export function formatPercent(pct: number, fractionDigits = 1): string {
  return `${Math.abs(pct).toFixed(fractionDigits)}%`;
}

/** Whole-number percentage, e.g. for gauges: `87%`. */
export function formatWholePercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** Thousands-separated integer, e.g. `1,284`. */
export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

/** Compact USD, e.g. `$184k`, `$1.2M`, `$640`. */
export function formatCurrencyCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${trimZero(value / 1_000_000)}M`;
  if (abs >= 1_000) return `$${trimZero(value / 1_000)}k`;
  return `$${Math.round(value)}`;
}

function trimZero(n: number): string {
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/**
 * Format a duration expressed in minutes into a compact human label.
 * e.g. 45 -> `45m`, 90 -> `1h 30m`, 240 -> `4h`.
 */
export function formatMinutes(totalMinutes: number): string {
  const minutes = Math.round(totalMinutes);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem === 0 ? `${hours}h` : `${hours}h ${rem}m`;
}

/**
 * Relative time from a "minutes ago" offset — deterministic (no wall clock).
 * e.g. 0 -> `just now`, 5 -> `5m ago`, 120 -> `2h ago`, 2880 -> `2d ago`.
 */
export function formatRelativeTime(minutesAgo: number): string {
  const m = Math.max(0, Math.round(minutesAgo));
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const hours = Math.floor(m / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/** Short weekday label, e.g. `Mon`. */
export function weekdayShort(date: Date): string {
  return WEEKDAYS_SHORT[date.getDay()];
}

/** Short month-day label, e.g. `Jun 09`. */
export function formatDayLabel(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}`;
}

/** Short date range label, e.g. `Jun 09 – Jun 15`. */
export function formatDateRange(start: Date, end: Date): string {
  return `${formatDayLabel(start)} – ${formatDayLabel(end)}`;
}
