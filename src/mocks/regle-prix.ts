import { hotelById, occupancyFor } from '../data.js';

/** Bornes du supplément, d'après teams/squad-2-prix/contracts/regle-prix.md v1.0.0. Montants en centimes. */
export interface PriceBounds {
  hotelId: string;
  date: string;
  forecastNight: string;
  occupancyRate: number;
  band: 'BASSE' | 'MOYENNE' | 'HAUTE';
  floorMinor: number;
  ceilingMinor: number;
  currency: 'EUR';
  forecastGeneratedAt: string;
}

/** Erreur 422 / 400 du contrat v1.0.0, format `{ code, message, details }`. */
export interface PriceBoundsError {
  status: 400 | 422;
  code: 'LCO_HOTEL_FULL' | 'LCO_FORECAST_MISSING' | 'LCO_HOTEL_NOT_IN_PILOT' | 'LCO_INVALID_REQUEST';
  message: string;
  details: Record<string, unknown>;
}

// Bornes incluses : 60 → MOYENNE, 85 → MOYENNE, 95 → HAUTE, 96 → COMPLET.
const BANDS = [
  { band: 'BASSE', max: 59, floorMinor: 1500, ceilingMinor: 3000 },
  { band: 'MOYENNE', max: 85, floorMinor: 2500, ceilingMinor: 4500 },
  { band: 'HAUTE', max: 95, floorMinor: 4000, ceilingMinor: 6000 },
] as const;

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function previousNight(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

const error = (status: PriceBoundsError['status'], code: PriceBoundsError['code'], message: string, details: Record<string, unknown>): PriceBoundsError =>
  ({ status, code, message, details });

/**
 * Mock de GET /v1/pricing/late-checkout/bounds. `date` est la date de départ ;
 * l'occupation lue est celle de la nuit qui précède (`forecastNight` = date − 1 jour).
 */
export function getPriceBounds(hotelId: string, date: string): PriceBounds | PriceBoundsError {
  if (!hotelId || !DATE.test(date)) return error(400, 'LCO_INVALID_REQUEST', 'hotelId and date (YYYY-MM-DD) are required', { hotelId, date });
  if (!hotelById(hotelId)) return error(422, 'LCO_HOTEL_NOT_IN_PILOT', 'Hotel is not in the pilot', { hotelId });
  const forecastNight = previousNight(date);
  const occupancyRate = occupancyFor(hotelId, forecastNight);
  if (occupancyRate === undefined) return error(422, 'LCO_FORECAST_MISSING', 'No occupancy forecast for the night before departure', { hotelId, forecastNight });
  const found = BANDS.find((b) => occupancyRate <= b.max);
  if (!found) return error(422, 'LCO_HOTEL_FULL', 'Forecast occupancy above 95 %', { hotelId, forecastNight, occupancyRate });
  return {
    hotelId,
    date,
    forecastNight,
    occupancyRate,
    band: found.band,
    floorMinor: found.floorMinor,
    ceilingMinor: found.ceilingMinor,
    currency: 'EUR',
    forecastGeneratedAt: `${forecastNight}T06:00:00+01:00`,
  };
}
