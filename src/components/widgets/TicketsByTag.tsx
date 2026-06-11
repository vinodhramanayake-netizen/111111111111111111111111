import { Card } from '@/components/primitives/Card';
import { formatNumber } from '@/lib/format';
import type { TagDatum } from '@/data/types';
import styles from './TicketsByTag.module.css';

export interface TicketsByTagProps {
  tags: TagDatum[];
}

/**
 * Tickets by Tag: sorted categories with proportional cyan bars and
 * right-aligned counts. Bars are scaled to the largest count in the set.
 */
export function TicketsByTag({ tags }: TicketsByTagProps) {
  const max = tags.reduce((m, t) => Math.max(m, t.count), 0) || 1;

  return (
    <Card title="Tickets by Tag">
      <ul className={styles.list}>
        {tags.map((t) => {
          const pct = Math.round((t.count / max) * 100);
          return (
            <li key={t.tag} className={styles.row} aria-label={`${t.tag}: ${t.count} tickets`}>
              <span className={styles.tag}>{t.tag}</span>
              <span className={styles.barTrack}>
                <span className={styles.barFill} style={{ width: `${pct}%` }} aria-hidden="true" />
              </span>
              <span className={styles.count}>{formatNumber(t.count)}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
