import { describe, expect, it } from 'vitest';
import { hashSeed } from './rng';
import { DEFAULT_SEED, getSeedFromSearch, parseSeed } from './seed';

describe('parseSeed', () => {
  it('falls back to the default seed for null/undefined/empty', () => {
    expect(parseSeed(null)).toBe(DEFAULT_SEED);
    expect(parseSeed(undefined)).toBe(DEFAULT_SEED);
    expect(parseSeed('')).toBe(DEFAULT_SEED);
    expect(parseSeed('   ')).toBe(DEFAULT_SEED);
  });

  it('uses an integer seed directly', () => {
    expect(parseSeed('2024')).toBe(2024);
    expect(parseSeed('0')).toBe(0);
  });

  it('hashes non-numeric strings to a stable integer', () => {
    expect(parseSeed('acme-demo')).toBe(hashSeed('acme-demo'));
    expect(parseSeed('acme-demo')).toBe(parseSeed('acme-demo'));
  });
});

describe('getSeedFromSearch', () => {
  it('reads ?seed= from the query string', () => {
    expect(getSeedFromSearch('?seed=2024')).toBe(2024);
    expect(getSeedFromSearch('seed=2024')).toBe(2024);
  });

  it('returns the default when the param is absent', () => {
    expect(getSeedFromSearch('')).toBe(DEFAULT_SEED);
    expect(getSeedFromSearch('?other=1')).toBe(DEFAULT_SEED);
  });
});
