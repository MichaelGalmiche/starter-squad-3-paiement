import { describe, expect, it } from 'vitest';
import { hotelById, occupancyFor, reservationById } from '../src/data.js';

describe('données synthétiques', () => {
  it('expose hôtels et réservations', () => {
    expect(hotelById('VEL-LYO-02')?.standardCheckoutTime).toBe('11:00');
    expect(reservationById('RES-104233')?.nightlyRateMinor).toBe(11900);
  });
  it("renvoie undefined quand une donnée manque", () => {
    expect(occupancyFor('VEL-LYO-02', '2030-01-01')).toBeUndefined();
  });
});
