import { describe, expect, it } from 'vitest';
import { getPriceBounds } from '../../src/mocks/regle-prix.js';

describe('mock regle-prix v0', () => {
  it('classe une occupation moyenne', () => {
    expect(getPriceBounds('VEL-LYO-02', '2026-11-03')).toMatchObject({ band: 'MOYENNE', floorMinor: 2500, ceilingMinor: 4500 });
  });
  it('ne vend rien au-delà de 95 %', () => {
    expect(getPriceBounds('VEL-MRS-04', '2026-11-05')).toMatchObject({ band: 'COMPLET', floorMinor: null });
  });
  it('signale une prévision absente', () => {
    expect(getPriceBounds('VEL-PAR-01', '2027-01-01')).toBeUndefined();
  });
});
