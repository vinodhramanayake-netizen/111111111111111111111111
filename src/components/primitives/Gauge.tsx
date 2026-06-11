import { colors } from '@/theme/tokens';
import styles from './Gauge.module.css';

export type GaugeVariant = 'radial' | 'semicircle';

export interface GaugeProps {
  /** Current value. */
  value: number;
  /** Scale minimum (default 0). */
  min?: number;
  /** Scale maximum. */
  max: number;
  /** `radial` = 270° dial; `semicircle` = 180° top arc. */
  variant?: GaugeVariant;
  /** Arc color (concrete CSS color — SVG stroke needs a value). */
  color?: string;
  /** Pre-formatted big value text (e.g. "87%"). Defaults to the rounded value. */
  valueText?: string;
  /** Small caption under the value (e.g. "CSAT"). */
  caption?: string;
  /** Accessible label, e.g. "CSAT score". */
  label: string;
  /** Pixel width of the SVG. */
  size?: number;
  /** Stroke thickness. */
  thickness?: number;
  className?: string;
}

const RADIAL_GAP = 90; // degrees of empty space at the bottom of the radial dial

/** Point on a circle; angle measured clockwise from the top (0° = 12 o'clock). */
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** SVG arc path drawn clockwise from `startAngle` to `endAngle` (end > start). */
function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polar(cx, cy, r, startAngle);
  const end = polar(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

/**
 * Shared SVG gauge for radial (CSAT) and semicircular (churn) displays.
 *
 * The numeric value is rendered as real, large DOM text for readability; the
 * wrapper carries `role="meter"` with aria-value* + an aria-label so assistive
 * tech announces the value while the decorative SVG stays `aria-hidden`.
 */
export function Gauge({
  value,
  min = 0,
  max,
  variant = 'radial',
  color = colors.primary,
  valueText,
  caption,
  label,
  size = 160,
  thickness = 12,
  className,
}: GaugeProps) {
  const ratio = clamp01((value - min) / (max - min || 1));

  const sweep = variant === 'radial' ? 360 - RADIAL_GAP : 180;
  const startAngle = variant === 'radial' ? 180 + RADIAL_GAP / 2 : 270;
  const endAngle = startAngle + sweep;
  const valueEndAngle = startAngle + sweep * ratio;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - thickness / 2 - 2;

  // Semicircle only needs the top half plus room for the value text.
  const viewHeight = variant === 'radial' ? size : cy + thickness;

  const display = valueText ?? String(Math.round(value));

  return (
    <div
      className={[styles.gauge, className].filter(Boolean).join(' ')}
      role="meter"
      aria-label={label}
      aria-valuenow={Math.round(value)}
      aria-valuemin={Math.round(min)}
      aria-valuemax={Math.round(max)}
      style={{ width: size }}
    >
      <svg
        className={styles.svg}
        width={size}
        height={viewHeight}
        viewBox={`0 0 ${size} ${viewHeight}`}
        aria-hidden="true"
        focusable="false"
      >
        <path
          d={arcPath(cx, cy, r, startAngle, endAngle)}
          fill="none"
          stroke="var(--color-track)"
          strokeWidth={thickness}
          strokeLinecap="round"
        />
        {ratio > 0 && (
          <path
            d={arcPath(cx, cy, r, startAngle, valueEndAngle)}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
          />
        )}
      </svg>
      <div
        className={variant === 'radial' ? styles.centerRadial : styles.centerSemi}
        aria-hidden="true"
      >
        <span className={styles.value}>{display}</span>
        {caption && <span className={styles.caption}>{caption}</span>}
      </div>
    </div>
  );
}
