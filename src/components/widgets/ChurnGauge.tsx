import { Card } from '@/components/primitives/Card';
import { Gauge } from '@/components/primitives/Gauge';
import { colors } from '@/theme/tokens';
import type { ChurnGauge as ChurnGaugeData } from '@/data/types';
import styles from './ChurnGauge.module.css';

export interface ChurnGaugeProps {
  churn: ChurnGaugeData;
}

/** Compact semicircular churn gauge (0–50%) with a red high-risk arc. */
export function ChurnGauge({ churn }: ChurnGaugeProps) {
  return (
    <Card title="Churn Rate">
      <div className={styles.wrap}>
        <Gauge
          value={churn.value}
          min={0}
          max={churn.max}
          variant="semicircle"
          color={colors.red}
          valueText={`${churn.value}%`}
          caption={`of ${churn.max}% max`}
          label={`Churn rate ${churn.value}% of ${churn.max}% maximum`}
          size={220}
        />
      </div>
    </Card>
  );
}
