import { describe, expect, it } from 'vitest';
import {
  computeDelta,
  formatCurrencyCompact,
  formatDateRange,
  formatDayLabel,
  formatMinutes,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  formatWholePercent,
  weekdayShort,
} from './format';

describe('computeDelta', () => {
  it('treats an increase as improvement for higher-is-better metrics', () => {
    const d = computeDelta(120, 100, false);
    expect(d.direction).toBe('up');
    expect(d.isImprovement).toBe(true);
    expect(d.pct).toBe(20);
  });

  it('treats a decrease as improvement for lower-is-better metrics', () => {
    const d = computeDelta(40, 50, true);
    expect(d.direction).toBe('down');
    expect(d.isImprovement).toBe(true);
    expect(d.pct).toBe(-20);
  });

  it('treats an increase as worsening for lower-is-better metrics', () => {
    const d = computeDelta(60, 50, true);
    expect(d.direction).toBe('up');
    expect(d.isImprovement).toBe(false);
  });

  it('reports flat with no improvement when unchanged', () => {
    const d = computeDelta(50, 50, false);
    expect(d.direction).toBe('flat');
    expect(d.isImprovement).toBe(false);
    expect(d.pct).toBe(0);
  });

  it('guards against divide-by-zero', () => {
    expect(computeDelta(10, 0, false).pct).toBe(0);
  });
});

describe('number + percent formatting', () => {
  it('formats percentages', () => {
    expect(formatPercent(-20)).toBe('20.0%');
    expect(formatPercent(4.25)).toBe('4.3%');
    expect(formatWholePercent(86.6)).toBe('87%');
  });

  it('formats thousands-separated numbers', () => {
    expect(formatNumber(1284)).toBe('1,284');
    expect(formatNumber(1000000)).toBe('1,000,000');
  });

  it('formats compact currency', () => {
    expect(formatCurrencyCompact(640)).toBe('$640');
    expect(formatCurrencyCompact(184000)).toBe('$184k');
    expect(formatCurrencyCompact(1_200_000)).toBe('$1.2M');
  });
});

describe('formatMinutes', () => {
  it('formats sub-hour and multi-hour durations', () => {
    expect(formatMinutes(45)).toBe('45m');
    expect(formatMinutes(60)).toBe('1h');
    expect(formatMinutes(90)).toBe('1h 30m');
    expect(formatMinutes(240)).toBe('4h');
  });
});

describe('formatRelativeTime', () => {
  it('formats minute/hour/day/week buckets', () => {
    expect(formatRelativeTime(0)).toBe('just now');
    expect(formatRelativeTime(5)).toBe('5m ago');
    expect(formatRelativeTime(120)).toBe('2h ago');
    expect(formatRelativeTime(60 * 24 * 2)).toBe('2d ago');
    expect(formatRelativeTime(60 * 24 * 10)).toBe('1w ago');
  });
});

describe('date labels', () => {
  it('formats weekday, day label and range', () => {
    // 2026-06-09 is a Tuesday
    const tue = new Date(2026, 5, 9);
    const mon = new Date(2026, 5, 15);
    expect(weekdayShort(tue)).toBe('Tue');
    expect(formatDayLabel(tue)).toBe('Jun 09');
    expect(formatDateRange(tue, mon)).toBe('Jun 09 – Jun 15');
  });
});
