import styles from './ProgressBar.module.css';

export interface ProgressBarProps {
  /** Current value. */
  value: number;
  /** Maximum (target) value. */
  max: number;
  /** Accessible label describing what the bar represents. */
  label: string;
  /** Fill color (CSS color or token var). Defaults to the green accent. */
  color?: string;
  className?: string;
}

/**
 * Accessible horizontal progress bar toward a target (e.g. LTV vs target).
 * Exposes `role="progressbar"` with aria-value* and clamps the fill to [0, max].
 */
export function ProgressBar({
  value,
  max,
  label,
  color = 'var(--color-green)',
  className,
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1;
  const ratio = Math.min(1, Math.max(0, value / safeMax));
  const pct = Math.round(ratio * 100);

  return (
    <div
      className={[styles.track, className].filter(Boolean).join(' ')}
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={Math.round(max)}
      aria-valuetext={`${pct}% of target`}
    >
      <div className={styles.fill} style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}
