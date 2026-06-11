import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FeedbackCarousel } from './FeedbackCarousel';
import type { FeedbackItem } from '@/data/types';

const items: FeedbackItem[] = [
  { id: 'p1', author: 'Maya', role: 'PM', sentiment: 'positive', text: 'Love it', minutesAgo: 30 },
  {
    id: 'n1',
    author: 'Sam',
    role: 'Eng',
    sentiment: 'negative',
    text: 'Hard to read',
    minutesAgo: 60,
  },
  {
    id: 'p2',
    author: 'Liam',
    role: 'Ops',
    sentiment: 'positive',
    text: 'So fast now',
    minutesAgo: 120,
  },
];

describe('FeedbackCarousel', () => {
  it('shows positive items only and hides negative ones', () => {
    render(<FeedbackCarousel items={items} />);
    expect(screen.getByText(/Love it/)).toBeInTheDocument();
    expect(screen.queryByText(/Hard to read/)).not.toBeInTheDocument();
  });

  it('renders a relative timestamp and one dot per positive item', () => {
    render(<FeedbackCarousel items={items} />);
    expect(screen.getByText('30m ago')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
  });

  it('advances to the next positive slide via the Next control', async () => {
    const user = userEvent.setup();
    render(<FeedbackCarousel items={items} />);
    await user.click(screen.getByRole('button', { name: 'Next feedback' }));
    expect(screen.getByText(/So fast now/)).toBeInTheDocument();
  });

  it('navigates directly via dot pagination', async () => {
    const user = userEvent.setup();
    render(<FeedbackCarousel items={items} />);
    await user.click(screen.getByRole('tab', { name: 'Go to feedback 2' }));
    expect(screen.getByText(/So fast now/)).toBeInTheDocument();
  });

  it('supports arrow-key navigation', async () => {
    const user = userEvent.setup();
    render(<FeedbackCarousel items={items} />);
    const region = screen.getByRole('group');
    region.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText(/So fast now/)).toBeInTheDocument();
  });

  it('renders an empty state when there is no positive feedback', () => {
    render(<FeedbackCarousel items={[items[1]]} />);
    expect(screen.getByText(/No positive feedback/i)).toBeInTheDocument();
  });
});
