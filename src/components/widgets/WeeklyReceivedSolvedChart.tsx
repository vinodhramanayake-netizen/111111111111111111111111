import { Card } from '@/components/primitives/Card';
import { colors } from '@/theme/tokens';
import type { DaySeriesPoint } from '@/data/types';
import styles from './WeeklyReceivedSolvedChart.module.css';

export interface WeeklyReceivedSolvedChartProps {
  days: DaySeriesPoint[];
}

// SVG geometry (viewBox units). Y axis is fixed 0–400 with ticks every 100.
const VIEW_W = 640;
const VIEW_H = 300;
const PAD = { top: 16, right: 16, bottom: 40, left: 44 };
const PLOT_W = VIEW_W - PAD.left - PAD.right;
const PLOT_H = VIEW_H - PAD.top - PAD.bottom;
const Y_MAX = 400;
const Y_TICKS = [0, 100, 200, 300, 400];

function xAt(index: number, count: number): number {
  if (count <= 1) return PAD.left + PLOT_W / 2;
  return PAD.left + (index / (count - 1)) * PLOT_W;
}

function yAt(value: number): number {
  return PAD.top + PLOT_H * (1 - Math.min(value, Y_MAX) / Y_MAX);
}

function toPoints(days: DaySeriesPoint[], key: 'received' | 'solved'): string {
  return days.map((d, i) => `${xAt(i, days.length)},${yAt(d[key])}`).join(' ');
}

/**
 * Custom SVG dual-line chart: weekly Received (blue) vs Solved (amber), Mon–Sun
 * with dates, an inline legend and a fixed 0–400 y-axis (ticks every 100).
 * No charting library — keeps the bundle lean.
 */
export function WeeklyReceivedSolvedChart({ days }: WeeklyReceivedSolvedChartProps) {
  const peakReceived = days.reduce((m, d) => Math.max(m, d.received), 0);

  const legend = (
    <div className={styles.legend}>
      <span className={styles.legendItem}>
        <span className={styles.swatch} style={{ backgroundColor: colors.primary }} />
        Received
      </span>
      <span className={styles.legendItem}>
        <span className={styles.swatch} style={{ backgroundColor: colors.amber }} />
        Solved
      </span>
    </div>
  );

  return (
    <Card title="Received vs Solved" action={legend}>
      <svg
        className={styles.chart}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label={`Weekly tickets received versus solved, Monday to Sunday. Received peaks at ${peakReceived} mid-week and drops over the weekend.`}
      >
        {/* Y grid + labels */}
        {Y_TICKS.map((tick) => {
          const y = yAt(tick);
          return (
            <g key={tick}>
              <line x1={PAD.left} y1={y} x2={VIEW_W - PAD.right} y2={y} className={styles.grid} />
              <text x={PAD.left - 10} y={y + 4} className={styles.axisLabel} textAnchor="end">
                {tick}
              </text>
            </g>
          );
        })}

        {/* X labels: weekday + date */}
        {days.map((d, i) => {
          const x = xAt(i, days.length);
          return (
            <g key={d.dateISO}>
              <text x={x} y={VIEW_H - PAD.bottom + 20} className={styles.xDay} textAnchor="middle">
                {d.dayShort}
              </text>
              <text x={x} y={VIEW_H - PAD.bottom + 34} className={styles.xDate} textAnchor="middle">
                {d.dateLabel}
              </text>
            </g>
          );
        })}

        {/* Series */}
        <polyline
          points={toPoints(days, 'received')}
          className={styles.line}
          style={{ stroke: colors.primary }}
        />
        <polyline
          points={toPoints(days, 'solved')}
          className={styles.line}
          style={{ stroke: colors.amber }}
        />

        {/* Point markers with accessible titles */}
        {days.map((d, i) => {
          const x = xAt(i, days.length);
          return (
            <g key={`pts-${d.dateISO}`}>
              <circle cx={x} cy={yAt(d.received)} r={3.5} style={{ fill: colors.primary }}>
                <title>{`${d.dayShort} ${d.dateLabel}: ${d.received} received`}</title>
              </circle>
              <circle cx={x} cy={yAt(d.solved)} r={3.5} style={{ fill: colors.amber }}>
                <title>{`${d.dayShort} ${d.dateLabel}: ${d.solved} solved`}</title>
              </circle>
            </g>
          );
        })}
      </svg>
    </Card>
  );
}
