import { Card } from '@/components/primitives/Card';
import { DeltaBadge } from '@/components/primitives/DeltaBadge';
import { Gauge } from '@/components/primitives/Gauge';
import { StatRow } from '@/components/primitives/StatRow';
import { colors } from '@/theme/tokens';
import { formatMinutes } from '@/lib/format';
import type { CsatGauge, TrendMetric } from '@/data/types';
import styles from './KpiPanel.module.css';

export interface KpiPanelProps {
  csat: CsatGauge;
  firstResponseTime: TrendMetric;
  avgResolutionTime: TrendMetric;
}

/**
 * Left KPI panel: CSAT radial gauge (healthy green arc) plus First Response and
 * Average Resolution times with units and prior-week delta badges.
 */
export function KpiPanel({ csat, firstResponseTime, avgResolutionTime }: KpiPanelProps) {
  return (
    <Card title="Weekly KPIs" className={styles.panel}>
      <div className={styles.gaugeWrap}>
        <Gauge
          value={csat.value}
          min={0}
          max={100}
          variant="radial"
          color={colors.green}
          valueText={`${csat.value}%`}
          caption="CSAT"
          label={`Customer satisfaction score ${csat.value}%`}
          size={188}
        />
      </div>

      <div className={styles.stats}>
        <StatRow
          label="First Response Time"
          value={formatMinutes(firstResponseTime.value)}
          trailing={
            <DeltaBadge
              value={firstResponseTime.value}
              previous={firstResponseTime.previous}
              lowerIsBetter={firstResponseTime.lowerIsBetter}
            />
          }
        />
        <StatRow
          label="Average Resolution Time"
          value={avgResolutionTime.value.toFixed(1)}
          unit={avgResolutionTime.unit}
          trailing={
            <DeltaBadge
              value={avgResolutionTime.value}
              previous={avgResolutionTime.previous}
              lowerIsBetter={avgResolutionTime.lowerIsBetter}
            />
          }
        />
      </div>
    </Card>
  );
}
