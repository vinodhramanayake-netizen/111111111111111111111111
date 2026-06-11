import { computeDelta, formatPercent } from '@/lib/format';
import styles from './DeltaBadge.module.css';

export interface DeltaBadgeProps {
  /** Current value. */
  value: number;
  /** Prior-week value to compare against. */
  previous: number;
  /** When true, a decrease is an improvement (e.g. response time). */
  lowerIsBetter?: boolean;
  /** Decimal places for the percentage (default 1). */
  fractionDigits?: number;
  /** Short comparison phrase used in the accessible label. */
  comparisonLabel?: string;
  className?: string;
}

const ARROW = { up: '▲', down: '▼', flat: '—' } as const;

/**
 * Compact trend indicator: a ▲/▼ glyph + percentage, coloured by whether the
 * change is an improvement (green) or a worsening (red); flat is muted.
 *
 * The arrow glyph is decorative (`aria-hidden`); the badge exposes a full
 * sentence via `aria-label` so assistive tech never reads a bare symbol.
 */
export function DeltaBadge({
  value,
  previous,
  lowerIsBetter = false,
  fractionDigits = 1,
  comparisonLabel = 'vs prior week',
  className,
}: DeltaBadgeProps) {
  const { pct, direction, isImprovement } = computeDelta(value, previous, lowerIsBetter);

  const tone = direction === 'flat' ? 'flat' : isImprovement ? 'up-good' : 'down-bad';
  const toneClass =
    tone === 'flat' ? styles.flat : tone === 'up-good' ? styles.improve : styles.worsen;

  const verb = direction === 'flat' ? 'unchanged' : isImprovement ? 'improved' : 'worsened';
  const ariaLabel =
    direction === 'flat'
      ? `Unchanged ${comparisonLabel}`
      : `${verb} ${formatPercent(pct, fractionDigits)} ${comparisonLabel}`;

  return (
    <span
      className={[styles.badge, toneClass, className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
    >
      <span aria-hidden="true" className={styles.arrow}>
        {ARROW[direction]}
      </span>
      <span aria-hidden="true">{formatPercent(pct, fractionDigits)}</span>
    </span>
  );
}
