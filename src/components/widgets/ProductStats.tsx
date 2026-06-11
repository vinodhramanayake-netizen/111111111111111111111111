import { Card } from '@/components/primitives/Card';
import { DeltaBadge } from '@/components/primitives/DeltaBadge';
import { StatRow } from '@/components/primitives/StatRow';
import { formatNumber } from '@/lib/format';
import type { TrendMetric } from '@/data/types';
import styles from './ProductStats.module.css';

export interface ProductStatsProps {
  newUsers: TrendMetric;
  reportsCreated: TrendMetric;
}

interface StatCardProps {
  label: string;
  metric: TrendMetric;
}

function StatCard({ label, metric }: StatCardProps) {
  return (
    <Card className={styles.card}>
      <StatRow
        label={label}
        value={formatNumber(metric.value)}
        trailing={
          <DeltaBadge
            value={metric.value}
            previous={metric.previous}
            lowerIsBetter={metric.lowerIsBetter}
          />
        }
      />
    </Card>
  );
}

/** Two stacked product stat cards with large numbers and prior-week deltas. */
export function ProductStats({ newUsers, reportsCreated }: ProductStatsProps) {
  return (
    <>
      <StatCard label="New users added" metric={newUsers} />
      <StatCard label="Reports created" metric={reportsCreated} />
    </>
  );
}
