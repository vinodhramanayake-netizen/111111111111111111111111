import { hashSeed } from './rng';

/** Fixed default seed — repeatable demos out of the box. */
export const DEFAULT_SEED = 1337;

/** Query parameter used to override the seed (client-side only). */
export const SEED_PARAM = 'seed';

/**
 * Resolve a raw seed value into the integer used to drive the RNG.
 *
 * - empty / nullish        -> DEFAULT_SEED
 * - a finite numeric string -> that integer
 * - any other string        -> stable hash of the string (so `?seed=acme` works)
 */
export function parseSeed(raw: string | null | undefined): number {
  if (raw == null) return DEFAULT_SEED;
  const trimmed = raw.trim();
  if (trimmed === '') return DEFAULT_SEED;

  const asNumber = Number(trimmed);
  if (Number.isFinite(asNumber) && Number.isInteger(asNumber)) {
    return Math.abs(asNumber) >>> 0;
  }
  return hashSeed(trimmed);
}

/**
 * Read the seed from a URL search string (e.g. `?seed=2024`).
 * Falls back to the default seed when the param is absent or invalid.
 */
export function getSeedFromSearch(search: string): number {
  const params = new URLSearchParams(search);
  return parseSeed(params.get(SEED_PARAM));
}
