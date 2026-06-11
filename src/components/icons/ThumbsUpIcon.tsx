import type { SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  /** Square pixel size (default 16). */
  size?: number;
}

/**
 * Inline thumbs-up glyph (uses `currentColor`, decorative by default).
 * Inline SVG keeps the bundle free of an icon-library dependency.
 */
export function ThumbsUpIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d="M2 10.5A1.5 1.5 0 0 1 3.5 9H6v11H3.5A1.5 1.5 0 0 1 2 18.5v-8Z" />
      <path d="M8 9.2 12.2 3a1.6 1.6 0 0 1 2.86 1.27L14.2 9h5.05a2 2 0 0 1 1.96 2.4l-1.3 6.5A2.5 2.5 0 0 1 17.46 20H8V9.2Z" />
    </svg>
  );
}
