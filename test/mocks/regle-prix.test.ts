import { describe, expect, it } from 'vitest';
import { getPriceBounds } from '../../src/mocks/regle-prix.js';

describe('mock regle-prix v1.0.0', () => {
  it('lit la nuit qui précède la date de départ', () => {
    expect(getPriceBounds('VEL-LYO-02', '2026-11-03')).toMatchObject({
      forecastNight: '2026-11-02', occupancyRate: 62, band: 'MOYENNE', floorMinor: 2500, ceilingMinor: 4500, currency: 'EUR',
    });
  });
  it('classe 59 % en BASSE', () => {
    expect(getPriceBounds('VEL-BDX-03', '2026-11-06')).toMatchObject({ occupancyRate: 59, band: 'BASSE' });
  });
  it('classe 86 % en HAUTE et 95 % en HAUTE', () => {
    expect(getPriceBounds('VEL-MRS-04', '2026-11-03')).toMatchObject({ occupancyRate: 86, band: 'HAUTE' });
    expect(getPriceBounds('VEL-MRS-04', '2026-11-05')).toMatchObject({ occupancyRate: 95, band: 'HAUTE' });
  });
  it('renvoie LCO_HOTEL_FULL au-delà de 95 %', () => {
    expect(getPriceBounds('VEL-PAR-01', '2026-11-06')).toMatchObject({ status: 422, code: 'LCO_HOTEL_FULL' });
  });
  it('renvoie LCO_FORECAST_MISSING si la prévision manque', () => {
    expect(getPriceBounds('VEL-PAR-01', '2027-01-01')).toMatchObject({ status: 422, code: 'LCO_FORECAST_MISSING' });
  });
  it('renvoie LCO_HOTEL_NOT_IN_PILOT hors pilote', () => {
    expect(getPriceBounds('VEL-XXX-99', '2026-11-03')).toMatchObject({ status: 422, code: 'LCO_HOTEL_NOT_IN_PILOT' });
  });
  it('renvoie LCO_INVALID_REQUEST si la date est mal formée', () => {
    expect(getPriceBounds('VEL-LYO-02', '03/11/2026')).toMatchObject({ status: 400, code: 'LCO_INVALID_REQUEST' });
  });
});
