import { describe, expect, it } from 'vitest';
import tokens, { colors, radii, spacing, typography } from './tokens';

describe('design tokens', () => {
  it('exposes the core token groups', () => {
    expect(tokens.colors).toBe(colors);
    expect(tokens.spacing).toBe(spacing);
    expect(tokens.radii).toBe(radii);
    expect(tokens.typography).toBe(typography);
  });

  it('defines all semantic accent colors as hex strings', () => {
    for (const value of Object.values(colors)) {
      expect(value).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('uses an ascending spacing scale', () => {
    const scale = [spacing.xs, spacing.sm, spacing.md, spacing.lg, spacing.xl, spacing.xxl];
    const sorted = [...scale].sort((a, b) => a - b);
    expect(scale).toEqual(sorted);
  });

  it('includes an Inter-based font stack with fallbacks', () => {
    expect(typography.fontFamily).toContain('Inter');
    expect(typography.fontFamily).toContain('sans-serif');
  });
});
