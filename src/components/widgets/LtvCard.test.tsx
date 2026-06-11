import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LtvCard } from './LtvCard';

describe('LtvCard', () => {
  it('renders the compact $ value and a labeled target', () => {
    render(<LtvCard ltv={{ value: 184000, target: 250000 }} />);
    expect(screen.getByText('$184k')).toBeInTheDocument();
    expect(screen.getByText('Target: $250k')).toBeInTheDocument();
  });

  it('renders a progress bar reflecting value/target', () => {
    render(<LtvCard ltv={{ value: 125000, target: 250000 }} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '125000');
    expect(bar).toHaveAttribute('aria-valuemax', '250000');
    expect(bar).toHaveAttribute('aria-valuetext', '50% of target');
  });
});
