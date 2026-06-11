import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Gauge } from './Gauge';

describe('Gauge', () => {
  it('exposes meter semantics with aria values and label', () => {
    render(<Gauge value={87} max={100} label="CSAT score" valueText="87%" caption="CSAT" />);
    const meter = screen.getByRole('meter', { name: 'CSAT score' });
    expect(meter).toHaveAttribute('aria-valuenow', '87');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders readable value text and caption', () => {
    render(<Gauge value={87} max={100} label="CSAT score" valueText="87%" caption="CSAT" />);
    expect(screen.getByText('87%')).toBeInTheDocument();
    expect(screen.getByText('CSAT')).toBeInTheDocument();
  });

  it('clamps out-of-range values for the aria scale and still renders an arc', () => {
    const { container } = render(
      <Gauge value={12.5} min={0} max={50} variant="semicircle" label="Churn rate" />,
    );
    const meter = screen.getByRole('meter', { name: 'Churn rate' });
    expect(meter).toHaveAttribute('aria-valuenow', '13');
    expect(meter).toHaveAttribute('aria-valuemax', '50');
    // track + value arc
    expect(container.querySelectorAll('path').length).toBeGreaterThanOrEqual(2);
  });

  it('renders only the track arc when the value is at the minimum', () => {
    const { container } = render(<Gauge value={0} min={0} max={50} label="Churn rate" />);
    expect(container.querySelectorAll('path')).toHaveLength(1);
  });
});
