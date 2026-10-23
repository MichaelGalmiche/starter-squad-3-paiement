import { occupancyFor } from '../data.js';

/** Bornes du supplément, d'après teams/squad-2-prix/contracts/regle-prix.md v0.1.0. Montants en centimes. */
export interface PriceBounds {
  hotelId: string;
  date: string;
  band: 'BASSE' | 'MOYENNE' | 'HAUTE' | 'COMPLET';
  floorMinor: number | null;
  ceilingMinor: number | null;
  currency: 'EUR';
}

const BANDS = [
  { band: 'BASSE', max: 60, floorMinor: 1500, ceilingMinor: 3000 },
  { band: 'MOYENNE', max: 85, floorMinor: 2500, ceilingMinor: 4500 },
  { band: 'HAUTE', max: 95, floorMinor: 4000, ceilingMinor: 6000 },
] as const;

/**
 * Mock de GET /v1/pricing/late-checkout/bounds. `date` est la nuit précédant le départ.
 * Renvoie undefined si la prévision d'occupation manque : comportement à préciser par la squad Prix (v1).
 */
export function getPriceBounds(hotelId: string, date: string): PriceBounds | undefined {
  const rate = occupancyFor(hotelId, date);
  if (rate === undefined) return undefined;
  const found = BANDS.find((b) => (b.band === 'BASSE' ? rate < b.max : rate <= b.max));
  if (!found) return { hotelId, date, band: 'COMPLET', floorMinor: null, ceilingMinor: null, currency: 'EUR' };
  return { hotelId, date, band: found.band, floorMinor: found.floorMinor, ceilingMinor: found.ceilingMinor, currency: 'EUR' };
}
