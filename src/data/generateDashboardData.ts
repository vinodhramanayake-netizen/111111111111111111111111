import { createRng, hashSeed, type Rng } from '@/lib/rng';
import { DEFAULT_SEED } from '@/lib/seed';
import { formatDateRange, formatDayLabel, weekdayShort } from '@/lib/format';
import type {
  DashboardData,
  DaySeriesPoint,
  FeedbackItem,
  Sentiment,
  TagDatum,
  TrendMetric,
} from './types';

export interface GenerateOptions {
  /** Resolved numeric/string seed. Defaults to the fixed demo seed. */
  seed?: number | string;
  /** Reference "now" used to derive the current week's dates. */
  now?: Date;
}

/** Operational tag set (AC #4 example list). 7 categories. */
const TAGS = [
  'Billing',
  'Bug',
  'Feature Request',
  'Account',
  'Performance',
  'Integration',
  'Other',
] as const;

const FEEDBACK_AUTHORS = [
  ['Maya Chen', 'Product Manager'],
  ['Liam Patel', 'Operations Lead'],
  ['Sofia Rossi', 'Support Engineer'],
  ['Noah Kim', 'Founder'],
  ['Ava Müller', 'Data Analyst'],
  ['Ethan Brooks', 'Customer Success'],
  ['Isla Romero', 'Designer'],
  ['Omar Haddad', 'CTO'],
] as const;

const POSITIVE_COMMENTS = [
  'The new dashboard makes our weekly review so much faster.',
  'Response times have noticeably improved — the team loves it.',
  'Clean layout and the KPIs tell a clear story at a glance.',
  'Onboarding was painless and support was incredibly helpful.',
  'Exactly the visibility we needed for stakeholder demos.',
  'The charts are crisp and easy to read on our big screen.',
  'Switching to this saved us hours of manual reporting.',
] as const;

const NEUTRAL_COMMENTS = [
  'Works as expected. Would like an export option eventually.',
  'Decent overview, still evaluating against our old tooling.',
  'Fine for now; curious how it scales with more data.',
] as const;

const NEGATIVE_COMMENTS = [
  'Wish the mobile layout were a bit easier to scan.',
  'Took me a moment to find the resolution-time metric.',
] as const;

/** Monday-anchored weekday volume weights — mid-week peak, weekend drop. */
const WEEKDAY_WEIGHTS = [0.78, 0.92, 1.0, 0.97, 0.84, 0.42, 0.34]; // Mon..Sun

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Start of the ISO week (Monday) for the given reference date, at local midnight. */
function startOfWeekMonday(now: Date): Date {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = d.getDay(); // 0=Sun..6=Sat
  const diffToMonday = (day + 6) % 7;
  d.setDate(d.getDate() - diffToMonday);
  return d;
}

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function buildTicketsByTag(rng: Rng): TagDatum[] {
  // 6 or 7 categories for the week.
  const count = rng.int(6, 7);
  const tags = TAGS.slice(0, count);
  return tags.map((tag) => ({ tag, count: rng.int(18, 240) })).sort((a, b) => b.count - a.count);
}

function buildFeedback(rng: Rng): FeedbackItem[] {
  // A realistic mix that is mostly positive (carousel defaults to positive-only).
  const total = rng.int(8, 10);
  const items: FeedbackItem[] = [];
  for (let i = 0; i < total; i += 1) {
    const roll = rng.next();
    let sentiment: Sentiment;
    let text: string;
    if (roll < 0.65) {
      sentiment = 'positive';
      text = rng.pick(POSITIVE_COMMENTS);
    } else if (roll < 0.85) {
      sentiment = 'neutral';
      text = rng.pick(NEUTRAL_COMMENTS);
    } else {
      sentiment = 'negative';
      text = rng.pick(NEGATIVE_COMMENTS);
    }
    const [author, role] = rng.pick(FEEDBACK_AUTHORS);
    items.push({
      id: `fb-${i + 1}`,
      author,
      role,
      sentiment,
      text,
      // Up to ~6 days ago, ascending so the feed reads newest-first after sort.
      minutesAgo: rng.int(2, 60 * 24 * 6),
    });
  }
  // Guarantee at least a few positive items regardless of seed.
  const positives = items.filter((i) => i.sentiment === 'positive');
  if (positives.length < 3) {
    for (let i = 0; i < 3 - positives.length; i += 1) {
      const [author, role] = rng.pick(FEEDBACK_AUTHORS);
      items.push({
        id: `fb-extra-${i + 1}`,
        author,
        role,
        sentiment: 'positive',
        text: rng.pick(POSITIVE_COMMENTS),
        minutesAgo: rng.int(2, 60 * 24 * 6),
      });
    }
  }
  return items.sort((a, b) => a.minutesAgo - b.minutesAgo);
}

function buildWeeklyVolume(rng: Rng, weekStart: Date): DaySeriesPoint[] {
  const peak = rng.int(300, 380); // weekly high stays under the 400 ceiling
  return WEEKDAY_WEIGHTS.map((weight, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);

    const jitter = rng.float(0.92, 1.08);
    const received = clamp(Math.round(peak * weight * jitter), 0, 400);
    // Solved tracks received but lags slightly (plausible backlog).
    const solveRatio = rng.float(0.72, 0.94);
    const solved = clamp(Math.round(received * solveRatio), 0, 400);

    return {
      dayShort: weekdayShort(date),
      dateISO: toISODate(date),
      dateLabel: formatDayLabel(date),
      received,
      solved,
    };
  });
}

function trend(value: number, previous: number, unit: string, lowerIsBetter: boolean): TrendMetric {
  return { value, previous, unit, lowerIsBetter };
}

/**
 * Generate the full dashboard dataset from a seed. Pure and deterministic for a
 * given (seed, now): the single source of truth for every widget.
 */
export function generateDashboardData(options: GenerateOptions = {}): DashboardData {
  const seedInput = options.seed ?? DEFAULT_SEED;
  const resolvedSeed = typeof seedInput === 'number' ? seedInput >>> 0 : hashSeed(seedInput);
  const now = options.now ?? new Date();
  const rng = createRng(seedInput);

  const weekStart = startOfWeekMonday(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  // Left KPI panel
  const csatValue = Math.round(rng.float(70, 100));
  const frtCurrent = rng.int(22, 75); // minutes
  const frtPrevious = rng.int(22, 85);
  const artCurrent = Math.round(rng.float(3.2, 9.5) * 10) / 10; // hours
  const artPrevious = Math.round(rng.float(3.2, 11) * 10) / 10;

  // Right column
  const newUsersCurrent = rng.int(820, 2400);
  const newUsersPrevious = rng.int(700, 2200);
  const reportsCurrent = rng.int(1400, 5200);
  const reportsPrevious = rng.int(1300, 5000);
  const churnValue = Math.round(rng.float(3, 18) * 10) / 10; // % within 0–50 gauge
  const ltvTarget = 250_000;
  const ltvValue = rng.int(120_000, 245_000);

  return {
    seed: resolvedSeed,
    week: {
      weekStartISO: toISODate(weekStart),
      weekEndISO: toISODate(weekEnd),
      rangeLabel: formatDateRange(weekStart, weekEnd),
    },
    csat: { value: csatValue },
    firstResponseTime: trend(frtCurrent, frtPrevious, 'min', true),
    avgResolutionTime: trend(artCurrent, artPrevious, 'h', true),
    ticketsByTag: buildTicketsByTag(rng),
    feedback: buildFeedback(rng),
    weeklyVolume: buildWeeklyVolume(rng, weekStart),
    newUsers: trend(newUsersCurrent, newUsersPrevious, '', false),
    reportsCreated: trend(reportsCurrent, reportsPrevious, '', false),
    churn: { value: churnValue, max: 50 },
    ltv: { value: ltvValue, target: ltvTarget },
  };
}
