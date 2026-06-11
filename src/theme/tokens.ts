/**
 * Canonical design tokens for DesignDashboard999.
 *
 * This module is the single source of truth for the dark theme. Raw values are
 * exported here (rather than only as CSS variables) because SVG gauges and the
 * custom charts need numeric/string values at runtime for geometry and strokes.
 *
 * `globals.css` mirrors these values as CSS custom properties (`--color-*`,
 * `--space-*`, etc.) for use inside CSS Modules. When changing a value, update
 * it HERE first and keep the matching CSS variable in sync.
 */

/** Color palette — deep background, navy card surfaces, semantic accents. */
export const colors = {
  // Surfaces
  background: '#0b1120',
  surface: '#111a2e',
  surfaceRaised: '#16213a',
  border: '#243049',

  // Text (tuned for WCAG 2.1 AA contrast on the surfaces above)
  textPrimary: '#f1f5f9',
  textSecondary: '#aab6cc',
  textMuted: '#7c8aa5',

  // Accents
  primary: '#3b82f6', // blue — primary accent / "Received" series
  primaryStrong: '#60a5fa',
  cyan: '#22d3ee', // tickets-by-tag bars
  amber: '#f59e0b', // warnings / "Solved" series
  green: '#22c55e', // positive trends / healthy arcs
  red: '#ef4444', // alerts / high-risk arcs

  // Translucent track for gauges/progress bars
  track: '#1f2a44',
} as const;

/** Spacing scale (px). */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/** Border radii (px). */
export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
} as const;

/** Typography tokens. */
export const typography = {
  fontFamily: "var(--font-inter), Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  fontSize: {
    xs: 12,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 24,
    xxl: 36,
    display: 48,
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.15,
    normal: 1.4,
  },
} as const;

/** Subtle, demo-friendly motion. */
export const motion = {
  durationFast: 150,
  durationBase: 250,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const tokens = {
  colors,
  spacing,
  radii,
  typography,
  motion,
} as const;

export type Tokens = typeof tokens;

export default tokens;
