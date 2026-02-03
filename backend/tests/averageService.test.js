import { normalizeWeightedAverage } from '../src/services/averageService.js';

describe('normalizeWeightedAverage', () => {
  it('formats number to two decimals', () => {
    expect(normalizeWeightedAverage(27.345)).toBe(27.35);
  });

  it('returns null for invalid input', () => {
    expect(normalizeWeightedAverage('invalid')).toBeNull();
  });
});
