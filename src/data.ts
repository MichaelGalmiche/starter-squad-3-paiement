import { readFileSync } from 'node:fs';

/** Données synthétiques du starter (dossier data/). Les données fictives complètes sont remises le jour J. */
export interface Hotel {
  hotelId: string;
  city: string;
  brand: string;
  rooms: number;
  standardCheckoutTime: string;
  latestCheckoutTime: string;
  timeZone: string;
}
export interface Reservation {
  reservationId: string;
  hotelId: string;
  status: 'CONFIRMED' | 'CANCELLED';
  checkIn: string;
  checkOut: string;
  nightlyRateMinor: number;
  currency: 'EUR';
  lateCheckoutPurchased: boolean;
}
export interface Occupancy {
  hotelId: string;
  night: string;
  occupancyRate: number;
}

function load<T>(name: string): T[] {
  return JSON.parse(readFileSync(new URL(`../data/${name}.json`, import.meta.url), 'utf8')) as T[];
}

export const hotels = load<Hotel>('hotels');
export const reservations = load<Reservation>('reservations');

export const hotelById = (id: string) => hotels.find((h) => h.hotelId === id);
export const reservationById = (id: string) => reservations.find((r) => r.reservationId === id);

/** Occupation prévue (%) pour la nuit indiquée, ou undefined si la prévision manque. */
export function occupancyFor(hotelId: string, night: string): number | undefined {
  return load<Occupancy>('occupation-prevue').find((o) => o.hotelId === hotelId && o.night === night)?.occupancyRate;
}
