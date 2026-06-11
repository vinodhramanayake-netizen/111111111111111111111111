/**
 * Typed contract for the entire dashboard dataset.
 * Every widget consumes a slice of `DashboardData` — this is the single
 * shape generated once per page load and shared via the data provider.
 */

export type Sentiment = 'positive' | 'neutral' | 'negative';

/** A metric with its prior-week comparison and polarity for delta badges. */
export interface TrendMetric {
  /** Current value. */
  value: number;
  /** Prior-week value, used to compute the delta badge. */
  previous: number;
  /** Display unit suffix, e.g. `min`, `h`, or `''`. */
  unit: string;
  /** When true, a decrease is an improvement (e.g. response time). */
  lowerIsBetter: boolean;
}

/** CSAT radial gauge data (value is a percentage 70–100). */
export interface CsatGauge {
  value: number;
}

/** A single tickets-by-tag category row. */
export interface TagDatum {
  tag: string;
  count: number;
}

/** A single customer feedback entry. */
export interface FeedbackItem {
  id: string;
  author: string;
  role: string;
  sentiment: Sentiment;
  text: string;
  /** Minutes since the feedback was left — drives the relative timestamp. */
  minutesAgo: number;
}

/** One day in the weekly Received vs Solved series. */
export interface DaySeriesPoint {
  /** e.g. `Mon`. */
  dayShort: string;
  /** ISO date (yyyy-mm-dd) for the day. */
  dateISO: string;
  /** e.g. `Jun 09`. */
  dateLabel: string;
  /** Tickets received (0–400). */
  received: number;
  /** Tickets solved (0–400). */
  solved: number;
}

/** Churn radial gauge (value is a percentage 0–50). */
export interface ChurnGauge {
  value: number;
  /** Gauge maximum (50). */
  max: number;
}

/** Lifetime-value progress-to-target card (USD). */
export interface LtvCard {
  value: number;
  target: number;
}

/** Metadata describing the week the demo data represents. */
export interface WeekMeta {
  weekStartISO: string;
  weekEndISO: string;
  /** e.g. `Jun 09 – Jun 15`. */
  rangeLabel: string;
}

/** The complete dataset powering the dashboard. */
export interface DashboardData {
  /** Resolved seed used to generate this dataset (for display/debugging). */
  seed: number;
  week: WeekMeta;

  // Left KPI panel
  csat: CsatGauge;
  firstResponseTime: TrendMetric;
  avgResolutionTime: TrendMetric;

  // Center column
  ticketsByTag: TagDatum[];
  feedback: FeedbackItem[];
  weeklyVolume: DaySeriesPoint[];

  // Right column
  newUsers: TrendMetric;
  reportsCreated: TrendMetric;
  churn: ChurnGauge;
  ltv: LtvCard;
}
