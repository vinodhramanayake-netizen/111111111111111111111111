import { describe, expect, it } from 'vitest';
import { createRng, hashSeed, mulberry32 } from './rng';

describe('hashSeed', () => {
  it('is deterministic and returns an unsigned 32-bit integer', () => {
    const a = hashSeed('acme-demo');
    const b = hashSeed('acme-demo');
    expect(a).toBe(b);
    expect(a).toBeGreaterThanOrEqual(0);
    expect(a).toBeLessThanOrEqual(0xffffffff);
    expect(Number.isInteger(a)).toBe(true);
  });

  it('produces different hashes for different inputs', () => {
    expect(hashSeed('one')).not.toBe(hashSeed('two'));
  });
});

describe('mulberry32', () => {
  it('produces the same sequence for the same seed', () => {
    const a = mulberry32(1337);
    const b = mulberry32(1337);
    const seqA = [a(), a(), a()];
    const seqB = [b(), b(), b()];
    expect(seqA).toEqual(seqB);
    seqA.forEach((n) => {
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    });
  });
});

describe('createRng', () => {
  it('is deterministic for the same seed and differs across seeds', () => {
    const sample = (seed: number | string) => {
      const rng = createRng(seed);
      return [rng.next(), rng.next(), rng.next()];
    };
    expect(sample(1337)).toEqual(sample(1337));
    expect(sample('a')).toEqual(sample('a'));
    expect(sample(1337)).not.toEqual(sample(2024));
  });

  it('int() stays within the inclusive range', () => {
    const rng = createRng(42);
    for (let i = 0; i < 500; i += 1) {
      const n = rng.int(5, 9);
      expect(n).toBeGreaterThanOrEqual(5);
      expect(n).toBeLessThanOrEqual(9);
      expect(Number.isInteger(n)).toBe(true);
    }
  });

  it('float() stays within [min, max)', () => {
    const rng = createRng(7);
    for (let i = 0; i < 500; i += 1) {
      const n = rng.float(2, 4);
      expect(n).toBeGreaterThanOrEqual(2);
      expect(n).toBeLessThan(4);
    }
  });

  it('pick() returns a member and throws on empty input', () => {
    const rng = createRng(1);
    const items = ['a', 'b', 'c'] as const;
    expect(items).toContain(rng.pick(items));
    expect(() => rng.pick([])).toThrow();
  });

  it('weightedIndex() respects zero weights', () => {
    const rng = createRng(99);
    for (let i = 0; i < 200; i += 1) {
      // middle option has zero weight -> should never be selected
      const idx = rng.weightedIndex([1, 0, 1]);
      expect(idx).not.toBe(1);
    }
  });

  it('shuffle() is a deterministic permutation that does not mutate input', () => {
    const input = [1, 2, 3, 4, 5];
    const a = createRng(123).shuffle(input);
    const b = createRng(123).shuffle(input);
    expect(a).toEqual(b);
    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect([...a].sort((x, y) => x - y)).toEqual(input);
  });
});
