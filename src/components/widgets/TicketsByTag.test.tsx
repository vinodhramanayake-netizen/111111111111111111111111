import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TicketsByTag } from './TicketsByTag';
import type { TagDatum } from '@/data/types';

const tags: TagDatum[] = [
  { tag: 'Billing', count: 200 },
  { tag: 'Bug', count: 150 },
  { tag: 'Account', count: 50 },
];

describe('TicketsByTag', () => {
  it('renders a row per tag with its count', () => {
    render(<TicketsByTag tags={tags} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(within(items[0]).getByText('Billing')).toBeInTheDocument();
    expect(within(items[0]).getByText('200')).toBeInTheDocument();
  });

  it('scales the proportional bar to the largest count', () => {
    const { container } = render(<TicketsByTag tags={tags} />);
    const fills = container.querySelectorAll<HTMLElement>('[style*="width"]');
    expect(fills[0].style.width).toBe('100%'); // 200/200
    expect(fills[2].style.width).toBe('25%'); // 50/200
  });

  it('exposes an accessible label per row', () => {
    render(<TicketsByTag tags={tags} />);
    expect(screen.getByLabelText('Billing: 200 tickets')).toBeInTheDocument();
  });
});
