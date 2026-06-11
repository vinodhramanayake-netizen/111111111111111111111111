'use client';

import { useDashboardData } from '@/data/DashboardDataProvider';
import {
  ChurnGauge,
  FeedbackCarousel,
  KpiPanel,
  LtvCard,
  ProductStats,
  TicketsByTag,
  WeeklyReceivedSolvedChart,
} from '@/components/widgets';
import styles from './DashboardView.module.css';

/**
 * Single-page dashboard. Reads the shared seeded dataset once and distributes
 * slices to each widget. Renders a skeleton until client-side generation runs.
 */
export function DashboardView() {
  const data = useDashboardData();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Weekly Analytics Dashboard</h1>
          <p className={styles.subtitle}>
            Support &amp; product performance
            {data ? ` · ${data.week.rangeLabel}` : ''}
          </p>
        </div>
        <span className={styles.demoBadge}>Demo data</span>
      </header>

      {!data ? (
        <DashboardSkeleton />
      ) : (
        <div className={styles.grid}>
          <div className={styles.left}>
            <KpiPanel
              csat={data.csat}
              firstResponseTime={data.firstResponseTime}
              avgResolutionTime={data.avgResolutionTime}
            />
          </div>

          <div className={styles.center}>
            <div className={styles.centerTopLeft}>
              <TicketsByTag tags={data.ticketsByTag} />
            </div>
            <div className={styles.centerTopRight}>
              <FeedbackCarousel items={data.feedback} />
            </div>
            <div className={styles.centerBottom}>
              <WeeklyReceivedSolvedChart days={data.weeklyVolume} />
            </div>
          </div>

          <div className={styles.right}>
            <ProductStats newUsers={data.newUsers} reportsCreated={data.reportsCreated} />
            <ChurnGauge churn={data.churn} />
            <LtvCard ltv={data.ltv} />
          </div>
        </div>
      )}
    </main>
  );
}

/** Placeholder grid shown before client-side data generation completes. */
function DashboardSkeleton() {
  return (
    <div className={styles.grid} aria-busy="true" aria-live="polite">
      <span className={styles.srOnly}>Loading dashboard…</span>
      <div className={styles.left}>
        <div className={`${styles.skeleton} ${styles.skeletonTall}`} />
      </div>
      <div className={styles.center}>
        <div className={styles.centerTopLeft}>
          <div className={styles.skeleton} />
        </div>
        <div className={styles.centerTopRight}>
          <div className={styles.skeleton} />
        </div>
        <div className={styles.centerBottom}>
          <div className={`${styles.skeleton} ${styles.skeletonChart}`} />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
        <div className={`${styles.skeleton} ${styles.skeletonTall}`} />
      </div>
    </div>
  );
}
