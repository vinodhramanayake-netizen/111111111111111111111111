import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KpiPanel } from './KpiPanel';

const props = {
  csat: { value: 88 },
  firstResponseTime: { value: 45, previous: 60, unit: 'min', lowerIsBetter: true },
  avgResolutionTime: { value: 6.4, previous: 6.0, unit: 'h', lowerIsBetter: true },
};

describe('KpiPanel', () => {
  it('renders the CSAT gauge as a meter with the value', () => {
    render(<KpiPanel {...props} />);
    const meter = screen.getByRole('meter', { name: /customer satisfaction score/i });
    expect(meter).toHaveAttribute('aria-valuenow', '88');
    expect(screen.getByText('88%')).toBeInTheDocument();
  });

  it('shows response and resolution times with units', () => {
    render(<KpiPanel {...props} />);
    expect(screen.getByText('First Response Time')).toBeInTheDocument();
    expect(screen.getByText('45m')).toBeInTheDocument();
    expect(screen.getByText('Average Resolution Time')).toBeInTheDocument();
    expect(screen.getByText('6.4')).toBeInTheDocument();
  });

  it('shows an improvement delta when response time falls', () => {
    render(<KpiPanel {...props} />);
    // 45 vs 60 with lowerIsBetter -> improvement
    expect(screen.getByLabelText(/improved 25\.0% vs prior week/i)).toBeInTheDocument();
  });

  it('shows a worsening delta when resolution time rises', () => {
    render(<KpiPanel {...props} />);
    // 6.4 vs 6.0 with lowerIsBetter -> worsened
    expect(screen.getByLabelText(/worsened/i)).toBeInTheDocument();
  });
});
