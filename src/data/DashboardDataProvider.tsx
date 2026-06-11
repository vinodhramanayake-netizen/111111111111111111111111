'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getSeedFromSearch } from '@/lib/seed';
import { generateDashboardData } from './generateDashboardData';
import type { DashboardData } from './types';

const DashboardDataContext = createContext<DashboardData | null>(null);

export interface DashboardDataProviderProps {
  children: React.ReactNode;
  /**
   * Optional explicit data — primarily for tests/storybook so consumers can be
   * rendered with a fixed dataset without touching `window`.
   */
  value?: DashboardData;
}

/**
 * Generates the seeded dataset exactly once, client-side after mount, and
 * shares it with every widget via context.
 *
 * Generation runs post-mount (not during render) so the static export's HTML
 * stays stable and a `?seed=` override never triggers a hydration mismatch.
 */
export function DashboardDataProvider({ children, value }: DashboardDataProviderProps) {
  const [data, setData] = useState<DashboardData | null>(value ?? null);

  useEffect(() => {
    if (value) return;
    const seed = getSeedFromSearch(window.location.search);
    setData(generateDashboardData({ seed, now: new Date() }));
  }, [value]);

  return <DashboardDataContext.Provider value={data}>{children}</DashboardDataContext.Provider>;
}

/**
 * Access the shared dashboard dataset. Returns `null` until generation has run
 * (first client paint), letting widgets render a skeleton/empty state.
 */
export function useDashboardData(): DashboardData | null {
  return useContext(DashboardDataContext);
}

/** Variant that throws if used outside a provider with data — for required contexts. */
export function useRequiredDashboardData(): DashboardData {
  const data = useContext(DashboardDataContext);
  if (!data) {
    throw new Error(
      'useRequiredDashboardData must be used within a populated DashboardDataProvider',
    );
  }
  return data;
}
