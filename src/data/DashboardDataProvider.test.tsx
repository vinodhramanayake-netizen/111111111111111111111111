import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DashboardDataProvider, useDashboardData } from './DashboardDataProvider';

function SeedProbe() {
  const data = useDashboardData();
  if (!data) return <span>loading</span>;
  return <span data-testid="seed">{data.seed}</span>;
}

// Records how many distinct data references consumers observe.
const refs = new Set<unknown>();
function RefProbe({ id }: { id: string }) {
  const data = useDashboardData();
  if (data) refs.add(data);
  return <span data-testid={id}>{data ? 'ready' : 'loading'}</span>;
}

describe('DashboardDataProvider', () => {
  it('renders loading before generation, then shares generated data', async () => {
    render(
      <DashboardDataProvider>
        <SeedProbe />
      </DashboardDataProvider>,
    );
    // After mount the effect runs and the default-seeded data appears.
    await waitFor(() => expect(screen.getByTestId('seed')).toBeInTheDocument());
    expect(screen.getByTestId('seed')).toHaveTextContent('1337');
  });

  it('shares a single dataset instance across multiple consumers', async () => {
    refs.clear();
    render(
      <DashboardDataProvider>
        <RefProbe id="a" />
        <RefProbe id="b" />
        <RefProbe id="c" />
      </DashboardDataProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('a')).toHaveTextContent('ready'));
    expect(screen.getByTestId('b')).toHaveTextContent('ready');
    expect(screen.getByTestId('c')).toHaveTextContent('ready');
    // All consumers see the exact same object reference -> generated once.
    expect(refs.size).toBe(1);
  });

  it('uses an explicit value when provided (no window access)', () => {
    const fixed = {
      seed: 4242,
    } as unknown as Parameters<typeof DashboardDataProvider>[0]['value'];
    render(
      <DashboardDataProvider value={fixed}>
        <SeedProbe />
      </DashboardDataProvider>,
    );
    expect(screen.getByTestId('seed')).toHaveTextContent('4242');
  });
});
