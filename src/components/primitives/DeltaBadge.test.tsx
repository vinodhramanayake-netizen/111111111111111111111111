import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DeltaBadge } from './DeltaBadge';

describe('DeltaBadge', () => {
  it('shows an up arrow and improvement label for higher-is-better gains', () => {
    render(<DeltaBadge value={120} previous={100} />);
    const badge = screen.getByLabelText(/improved 20\.0% vs prior week/i);
    expect(badge).toHaveTextContent('▲');
    expect(badge).toHaveTextContent('20.0%');
  });

  it('treats a decrease as improvement for lower-is-better metrics', () => {
    render(<DeltaBadge value={40} previous={50} lowerIsBetter />);
    const badge = screen.getByLabelText(/improved 20\.0% vs prior week/i);
    expect(badge).toHaveTextContent('▼');
  });

  it('treats an increase as worsening for lower-is-better metrics', () => {
    render(<DeltaBadge value={60} previous={50} lowerIsBetter />);
    expect(screen.getByLabelText(/worsened 20\.0% vs prior week/i)).toHaveTextContent('▲');
  });

  it('renders an unchanged state when values are equal', () => {
    render(<DeltaBadge value={50} previous={50} />);
    expect(screen.getByLabelText(/unchanged vs prior week/i)).toHaveTextContent('—');
  });

  it('supports a custom comparison label', () => {
    render(<DeltaBadge value={120} previous={100} comparisonLabel="vs last month" />);
    expect(screen.getByLabelText(/improved 20\.0% vs last month/i)).toBeInTheDocument();
  });
});
