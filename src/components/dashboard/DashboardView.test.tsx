import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DashboardView } from './DashboardView';
import { DashboardDataProvider } from '@/data/DashboardDataProvider';
import { generateDashboardData } from '@/data/generateDashboardData';

const NOW = new Date(2026, 5, 9, 12, 0, 0);

describe('DashboardView', () => {
  it('renders a loading skeleton when no data is available yet', () => {
    // With no populated provider, the shared data is null -> skeleton state.
    render(<DashboardView />);
    expect(screen.getByText(/Loading dashboard/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Weekly KPIs' })).not.toBeInTheDocument();
  });

  it('composes every widget from a single shared dataset', async () => {
    const data = generateDashboardData({ seed: 1337, now: NOW });
    render(
      <DashboardDataProvider value={data}>
        <DashboardView />
      </DashboardDataProvider>,
    );

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Weekly KPIs' })).toBeInTheDocument(),
    );
    expect(screen.getByRole('heading', { name: 'Tickets by Tag' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Customer Feedback' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Received vs Solved' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Churn Rate' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Customer LTV' })).toBeInTheDocument();
    expect(screen.getByText('New users added')).toBeInTheDocument();
    expect(screen.getByText('Reports created')).toBeInTheDocument();

    // Week range from the fixed reference date appears in the header.
    expect(screen.getByText(/Jun 08 – Jun 14/)).toBeInTheDocument();
  });
});
