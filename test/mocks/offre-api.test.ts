import { describe, expect, it } from 'vitest';
import { getOffer, getOfferById } from '../../src/mocks/offre-api.js';

describe('mock offre-api v0', () => {
  it('propose des créneaux en centimes pour une réservation confirmée', () => {
    const offer = getOffer('RES-104233');
    expect(offer).toMatchObject({ eligible: true, hotelId: 'VEL-LYO-02', standardCheckoutTime: '11:00' });
    expect(offer?.options[0]).toEqual({ slot: '12:00', priceMinor: 2500, currency: 'EUR' });
  });
  it("refuse une réservation annulée ou déjà achetée", () => {
    expect(getOffer('RES-104236')?.reasons).toContain('CANCELLED');
    expect(getOffer('RES-104237')?.reasons).toContain('ALREADY_PURCHASED');
  });
  it('retrouve une offre par son identifiant', () => {
    expect(getOfferById('LCO-104233')?.reservationId).toBe('RES-104233');
    expect(getOffer('RES-000000')).toBeUndefined();
  });
});
