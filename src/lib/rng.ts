/**
 * Deterministic, dependency-free seeded pseudo-random number generator.
 *
 * Uses an FNV-1a-style string hash to derive a 32-bit seed, then `mulberry32`
 * for the PRNG sequence. The same seed always yields the same sequence, which
 * is what makes the dashboard's demo data repeatable across refreshes.
 */

/** Hash an arbitrary string/number seed into an unsigned 32-bit integer. */
export function hashSeed(input: string | number): number {
  const str = String(input);
  // FNV-1a 32-bit
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 PRNG — returns a function producing floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A small, ergonomic random API bound to a single seeded sequence. */
export interface Rng {
  /** Next float in [0, 1). */
  next(): number;
  /** Float in [min, max). */
  float(min: number, max: number): number;
  /** Integer in [min, max] (inclusive). */
  int(min: number, max: number): number;
  /** Boolean that is true with probability `p` (default 0.5). */
  bool(p?: number): boolean;
  /** Pick a single element from a non-empty array. */
  pick<T>(items: readonly T[]): T;
  /** Pick an index using positive relative weights. */
  weightedIndex(weights: readonly number[]): number;
  /** Return a new array shuffled with Fisher–Yates (does not mutate input). */
  shuffle<T>(items: readonly T[]): T[];
}

/** Create a seeded RNG. Accepts a numeric or string seed. */
export function createRng(seed: string | number): Rng {
  const next = mulberry32(typeof seed === 'number' ? seed >>> 0 : hashSeed(seed));

  const float = (min: number, max: number): number => min + next() * (max - min);
  const int = (min: number, max: number): number => Math.floor(float(min, max + 1));

  return {
    next,
    float,
    int,
    bool: (p = 0.5) => next() < p,
    pick: <T>(items: readonly T[]): T => {
      if (items.length === 0) throw new Error('rng.pick: cannot pick from an empty array');
      return items[Math.floor(next() * items.length)];
    },
    weightedIndex: (weights: readonly number[]): number => {
      const total = weights.reduce((sum, w) => sum + Math.max(0, w), 0);
      if (total <= 0) throw new Error('rng.weightedIndex: weights must sum to a positive number');
      let threshold = next() * total;
      for (let i = 0; i < weights.length; i += 1) {
        threshold -= Math.max(0, weights[i]);
        if (threshold < 0) return i;
      }
      return weights.length - 1;
    },
    shuffle: <T>(items: readonly T[]): T[] => {
      const result = [...items];
      for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(next() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    },
  };
}
