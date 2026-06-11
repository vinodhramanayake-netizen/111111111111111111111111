import type { ElementType, ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps {
  /** Optional card title — rendered as an accessible heading. */
  title?: ReactNode;
  /** Heading level for the title (defaults to h2). */
  headingLevel?: 2 | 3;
  /** Optional trailing slot in the header (e.g. a legend or action). */
  action?: ReactNode;
  /** Root element type (defaults to `section`). */
  as?: ElementType;
  /** Accessible label when there is no visible title. */
  'aria-label'?: string;
  className?: string;
  /** Class applied to the inner body wrapper for per-card layout. */
  bodyClassName?: string;
  children?: ReactNode;
}

/**
 * Themed surface container — the base for every dashboard widget.
 * Presentational only; composes via CSS custom properties from globals.css.
 */
export function Card({
  title,
  headingLevel = 2,
  action,
  as: Root = 'section',
  className,
  bodyClassName,
  children,
  ...rest
}: CardProps) {
  const Heading = `h${headingLevel}` as ElementType;
  const hasHeader = title != null || action != null;

  return (
    <Root className={[styles.card, className].filter(Boolean).join(' ')} {...rest}>
      {hasHeader && (
        <div className={styles.header}>
          {title != null && <Heading className={styles.title}>{title}</Heading>}
          {action != null && <div className={styles.action}>{action}</div>}
        </div>
      )}
      <div className={[styles.body, bodyClassName].filter(Boolean).join(' ')}>{children}</div>
    </Root>
  );
}
