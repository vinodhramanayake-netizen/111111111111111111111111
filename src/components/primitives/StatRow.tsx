import type { ReactNode } from 'react';
import styles from './StatRow.module.css';

export interface StatRowProps {
  /** Metric label, e.g. "First Response Time". */
  label: ReactNode;
  /** Primary value, rendered large. */
  value: ReactNode;
  /** Optional unit suffix shown next to the value, e.g. "min". */
  unit?: ReactNode;
  /** Optional trailing slot, typically a <DeltaBadge />. */
  trailing?: ReactNode;
  className?: string;
}

/**
 * Label + large value (+ optional unit) with an optional trailing slot.
 * Backs the KPI time stats and product stat cards.
 */
export function StatRow({ label, value, unit, trailing, className }: StatRowProps) {
  return (
    <div className={[styles.row, className].filter(Boolean).join(' ')}>
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        <span className={styles.valueLine}>
          <span className={styles.value}>{value}</span>
          {unit != null && <span className={styles.unit}>{unit}</span>}
        </span>
      </div>
      {trailing != null && <div className={styles.trailing}>{trailing}</div>}
    </div>
  );
}
