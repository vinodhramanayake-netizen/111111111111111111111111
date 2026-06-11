import { describe, expect, it } from 'vitest';
import { DEFAULT_SEED } from '@/lib/seed';
import { generateDashboardData } from './generateDashboardData';

// Fixed reference date (a Tuesday) so date-derived fields are stable in tests.
const NOW = new Date(2026, 5, 9, 12, 0, 0);

describe('generateDashboardData — determinism', () => {
  it('produces identical output for the same seed and now', () => {
    const a = generateDashboardData({ seed: DEFAULT_SEED, now: NOW });
    const b = generateDashboardData({ seed: DEFAULT_SEED, now: NOW });
    expect(a).toEqual(b);
  });

  it('produces different output for different seeds', () => {
    const a = generateDashboardData({ seed: 1337, now: NOW });
    const b = generateDashboardData({ seed: 2024, now: NOW });
    expect(a).not.toEqual(b);
  });

  it('records the resolved numeric seed', () => {
    expect(generateDashboardData({ seed: 2024, now: NOW }).seed).toBe(2024);
    expect(generateDashboardData({ now: NOW }).seed).toBe(DEFAULT_SEED);
  });
});

describe('generateDashboardData — acceptance-criteria invariants', () => {
  // Exercise a spread of seeds to ensure clamping holds for any dataset.
  const seeds = [DEFAULT_SEED, 2024, 1, 7, 99999, 'acme-demo'];

  it('CSAT is within 70–100', () => {
    for (const seed of seeds) {
      const { csat } = generateDashboardData({ seed, now: NOW });
      expect(csat.value).toBeGreaterThanOrEqual(70);
      expect(csat.value).toBeLessThanOrEqual(100);
    }
  });

  it('churn is within 0–50 with max 50', () => {
    for (const seed of seeds) {
      const { churn } = generateDashboardData({ seed, now: NOW });
      expect(churn.value).toBeGreaterThanOrEqual(0);
      expect(churn.value).toBeLessThanOrEqual(50);
      expect(churn.max).toBe(50);
    }
  });

  it('has 6–7 tags sorted by count descending', () => {
    for (const seed of seeds) {
      const { ticketsByTag } = generateDashboardData({ seed, now: NOW });
      expect(ticketsByTag.length).toBeGreaterThanOrEqual(6);
      expect(ticketsByTag.length).toBeLessThanOrEqual(7);
      const counts = ticketsByTag.map((t) => t.count);
      expect(counts).toEqual([...counts].sort((a, b) => b - a));
    }
  });

  it('feedback contains positive items and valid sentiments', () => {
    for (const seed of seeds) {
      const { feedback } = generateDashboardData({ seed, now: NOW });
      expect(feedback.some((f) => f.sentiment === 'positive')).toBe(true);
      feedback.forEach((f) => {
        expect(['positive', 'neutral', 'negative']).toContain(f.sentiment);
        expect(f.minutesAgo).toBeGreaterThanOrEqual(0);
        expect(f.text.length).toBeGreaterThan(0);
      });
    }
  });

  it('weekly volume has 7 Mon–Sun days within 0–400 and a mid-week peak', () => {
    for (const seed of seeds) {
      const { weeklyVolume } = generateDashboardData({ seed, now: NOW });
      expect(weeklyVolume).toHaveLength(7);
      expect(weeklyVolume.map((d) => d.dayShort)).toEqual([
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun',
      ]);
      weeklyVolume.forEach((d) => {
        expect(d.received).toBeGreaterThanOrEqual(0);
        expect(d.received).toBeLessThanOrEqual(400);
        expect(d.solved).toBeGreaterThanOrEqual(0);
        expect(d.solved).toBeLessThanOrEqual(400);
        expect(d.dateLabel).toMatch(/^[A-Z][a-z]{2} \d{2}$/);
      });
      const midweek = Math.max(weeklyVolume[2].received, weeklyVolume[3].received);
      const weekend = Math.max(weeklyVolume[5].received, weeklyVolume[6].received);
      expect(midweek).toBeGreaterThan(weekend);
    }
  });

  it('LTV value is positive and at or below the target', () => {
    for (const seed of seeds) {
      const { ltv } = generateDashboardData({ seed, now: NOW });
      expect(ltv.value).toBeGreaterThan(0);
      expect(ltv.target).toBe(250_000);
      expect(ltv.value).toBeLessThanOrEqual(ltv.target);
    }
  });

  it('derives the Monday-anchored week range from the reference date', () => {
    const { week } = generateDashboardData({ seed: DEFAULT_SEED, now: NOW });
    // Week containing Tue 2026-06-09 starts Mon 2026-06-08, ends Sun 2026-06-14.
    expect(week.weekStartISO).toBe('2026-06-08');
    expect(week.weekEndISO).toBe('2026-06-14');
    expect(week.rangeLabel).toBe('Jun 08 – Jun 14');
  });
});
