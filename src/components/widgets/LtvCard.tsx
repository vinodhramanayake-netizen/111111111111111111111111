import { Card } from '@/components/primitives/Card';
import { ProgressBar } from '@/components/primitives/ProgressBar';
import { colors } from '@/theme/tokens';
import { formatCurrencyCompact } from '@/lib/format';
import type { LtvCard as LtvCardData } from '@/data/types';
import styles from './LtvCard.module.css';

export interface LtvCardProps {
  ltv: LtvCardData;
}

/** Lifetime-value card: large $ value and a progress bar toward a labeled target. */
export function LtvCard({ ltv }: LtvCardProps) {
  const pct = Math.round((ltv.value / (ltv.target || 1)) * 100);

  return (
    <Card title="Customer LTV">
      <div className={styles.valueRow}>
        <span className={styles.value}>{formatCurrencyCompact(ltv.value)}</span>
        <span className={styles.pct}>{pct}% of target</span>
      </div>
      <ProgressBar
        value={ltv.value}
        max={ltv.target}
        label={`Lifetime value progress toward target of ${formatCurrencyCompact(ltv.target)}`}
        color={colors.green}
      />
      <p className={styles.target}>Target: {formatCurrencyCompact(ltv.target)}</p>
    </Card>
  );
}
