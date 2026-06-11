import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './IconButton.module.css';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required accessible label — the button is icon-only. */
  'aria-label': string;
  children: ReactNode;
}

/**
 * Icon-only button with a comfortable hit area and visible focus.
 * Always `type="button"` by default; forwards all native button props so
 * stateful parents (e.g. the feedback carousel) can wire handlers.
 */
export function IconButton({ children, className, type, ...rest }: IconButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={[styles.button, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
