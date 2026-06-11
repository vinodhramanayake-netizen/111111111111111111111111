import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('exposes progressbar semantics with aria values', () => {
    render(<ProgressBar value={184000} max={250000} label="LTV toward target" />);
    const bar = screen.getByRole('progressbar', { name: 'LTV toward target' });
    expect(bar).toHaveAttribute('aria-valuenow', '184000');
    expect(bar).toHaveAttribute('aria-valuemax', '250000');
    expect(bar).toHaveAttribute('aria-valuetext', '74% of target');
  });

  it('clamps the fill so it never exceeds the target', () => {
    render(<ProgressBar value={300} max={250} label="Over target" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '100% of target');
  });

  it('handles a zero/invalid max without dividing by zero', () => {
    render(<ProgressBar value={10} max={0} label="No target" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '100% of target');
  });
});
