import { hotelById, reservationById } from '../data.js';

/** Réponse de GET /v1/reservations/{id}/late-checkout-offer, d'après teams/squad-1-offre/contracts/offre-api.md v0.1.0. */
export interface LateCheckoutOffer {
  offerId: string;
  reservationId: string;
  hotelId: string;
  eligible: boolean;
  reasons: string[];
  standardCheckoutTime: string;
  options: { slot: string; priceMinor: number; currency: 'EUR' }[];
  expiresAt: string;
}

/** Mock simplifié : prix fixes par créneau, sans appel à la règle de prix. Suffisant pour développer contre le contrat. */
export function getOffer(reservationId: string): LateCheckoutOffer | undefined {
  const reservation = reservationById(reservationId);
  if (!reservation) return undefined;
  const hotel = hotelById(reservation.hotelId);
  if (!hotel) return undefined;
  const reasons: string[] = [];
  if (reservation.status === 'CANCELLED') reasons.push('CANCELLED');
  if (reservation.lateCheckoutPurchased) reasons.push('ALREADY_PURCHASED');
  const eligible = reasons.length === 0;
  const start = Number(hotel.standardCheckoutTime.slice(0, 2)) + 1;
  const end = Number(hotel.latestCheckoutTime.slice(0, 2));
  const options = eligible
    ? Array.from({ length: end - start + 1 }, (_, i) => ({
        slot: `${String(start + i).padStart(2, '0')}:00`,
        priceMinor: 2500 + 1000 * i,
        currency: 'EUR' as const,
      }))
    : [];
  return {
    offerId: `LCO-${reservationId.slice(4)}`,
    reservationId,
    hotelId: hotel.hotelId,
    eligible,
    reasons,
    standardCheckoutTime: hotel.standardCheckoutTime,
    options,
    expiresAt: `${reservation.checkOut}T22:00:00+01:00`,
  };
}

/** Retrouve une offre par son identifiant (utile au paiement). */
export function getOfferById(offerId: string): LateCheckoutOffer | undefined {
  return getOffer(`RES-${offerId.replace(/^LCO-/, '')}`);
}
