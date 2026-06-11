'use client';

import { useCallback, useId, useMemo, useState, type KeyboardEvent } from 'react';
import { Card } from '@/components/primitives/Card';
import { IconButton } from '@/components/primitives/IconButton';
import { ThumbsUpIcon } from '@/components/icons/ThumbsUpIcon';
import { formatRelativeTime } from '@/lib/format';
import type { FeedbackItem } from '@/data/types';
import styles from './FeedbackCarousel.module.css';

export interface FeedbackCarouselProps {
  items: FeedbackItem[];
}

/**
 * Customer Feedback carousel — shows positive-sentiment items only, one at a
 * time, with prev/next controls and dot pagination. Fully keyboard operable
 * (focusable controls + ←/→ on the region) with visible focus.
 */
export function FeedbackCarousel({ items }: FeedbackCarouselProps) {
  const positives = useMemo(() => items.filter((i) => i.sentiment === 'positive'), [items]);
  const [index, setIndex] = useState(0);
  const count = positives.length;
  const labelId = useId();

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(index + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(index - 1);
      }
    },
    [go, index],
  );

  const active = positives[Math.min(index, Math.max(0, count - 1))];

  return (
    <Card title="Customer Feedback">
      {count === 0 || !active ? (
        <p className={styles.empty}>No positive feedback this week.</p>
      ) : (
        <div
          className={styles.carousel}
          role="group"
          aria-roledescription="carousel"
          aria-labelledby={labelId}
          onKeyDown={onKeyDown}
          tabIndex={0}
        >
          <span id={labelId} className={styles.srOnly}>
            Positive customer feedback, item {index + 1} of {count}
          </span>

          <figure className={styles.slide}>
            <span className={styles.thumb} aria-hidden="true">
              <ThumbsUpIcon size={18} />
            </span>
            <blockquote className={styles.quote}>“{active.text}”</blockquote>
            <figcaption className={styles.meta}>
              <span className={styles.author}>{active.author}</span>
              <span className={styles.role}>{active.role}</span>
              <span className={styles.time}>{formatRelativeTime(active.minutesAgo)}</span>
            </figcaption>
          </figure>

          <div className={styles.controls}>
            <IconButton aria-label="Previous feedback" onClick={() => go(index - 1)}>
              <span aria-hidden="true">‹</span>
            </IconButton>

            <div className={styles.dots} role="tablist" aria-label="Feedback slides">
              {positives.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to feedback ${i + 1}`}
                  className={[styles.dot, i === index ? styles.dotActive : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => go(i)}
                />
              ))}
            </div>

            <IconButton aria-label="Next feedback" onClick={() => go(index + 1)}>
              <span aria-hidden="true">›</span>
            </IconButton>
          </div>
        </div>
      )}
    </Card>
  );
}
