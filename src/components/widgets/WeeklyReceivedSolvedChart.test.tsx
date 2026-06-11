import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WeeklyReceivedSolvedChart } from './WeeklyReceivedSolvedChart';
import type { DaySeriesPoint } from '@/data/types';

const days: DaySeriesPoint[] = [
  { dayShort: 'Mon', dateISO: '2026-06-08', dateLabel: 'Jun 08', received: 200, solved: 160 },
  { dayShort: 'Tue', dateISO: '2026-06-09', dateLabel: 'Jun 09', received: 260, solved: 210 },
  { dayShort: 'Wed', dateISO: '2026-06-10', dateLabel: 'Jun 10', received: 340, solved: 300 },
  { dayShort: 'Thu', dateISO: '2026-06-11', dateLabel: 'Jun 11', received: 320, solved: 280 },
  { dayShort: 'Fri', dateISO: '2026-06-12', dateLabel: 'Jun 12', received: 240, solved: 200 },
  { dayShort: 'Sat', dateISO: '2026-06-13', dateLabel: 'Jun 13', received: 120, solved: 100 },
  { dayShort: 'Sun', dateISO: '2026-06-14', dateLabel: 'Jun 14', received: 90, solved: 70 },
];

describe('WeeklyReceivedSolvedChart', () => {
  it('renders an inline legend for both series', () => {
    render(<WeeklyReceivedSolvedChart days={days} />);
    expect(screen.getByText('Received')).toBeInTheDocument();
    expect(screen.getByText('Solved')).toBeInTheDocument();
  });

  it('renders Y-axis ticks at 0–400 in increments of 100', () => {
    render(<WeeklyReceivedSolvedChart days={days} />);
    ['0', '100', '200', '300', '400'].forEach((tick) => {
      expect(screen.getByText(tick)).toBeInTheDocument();
    });
  });

  it('labels every weekday with its date', () => {
    render(<WeeklyReceivedSolvedChart days={days} />);
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Jun 10')).toBeInTheDocument();
  });

  it('draws two series polylines and is labeled for screen readers', () => {
    const { container } = render(<WeeklyReceivedSolvedChart days={days} />);
    expect(container.querySelectorAll('polyline')).toHaveLength(2);
    expect(screen.getByRole('img', { name: /received versus solved/i })).toBeInTheDocument();
  });
});
