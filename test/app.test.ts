import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';

const call = { method: 'POST' as const, url: '/v1/late-checkout/payments' };

describe('starter squad-3-paiement', () => {
  it('répond sur /health avec la squad et ses flags', async () => {
    const app = buildApp({ flags: { lco_paiement_api: false } });
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ status: 'ok', squad: 'squad-3-paiement', flags: { lco_paiement_api: false } });
  });

  it('masque la route tant que le flag est désactivé', async () => {
    const app = buildApp({ flags: { lco_paiement_api: false } });
    const res = await app.inject(call);
    expect(res.statusCode).toBe(404);
    expect(res.json()).toMatchObject({ code: 'LCO_FEATURE_DISABLED' });
  });

  it('expose la route en bouchon quand le flag est activé', async () => {
    const app = buildApp({ flags: { lco_paiement_api: true } });
    const res = await app.inject(call);
    expect(res.statusCode).toBe(501);
    expect(res.json()).toMatchObject({ code: 'LCO_NOT_IMPLEMENTED' });
  });

  it('compte les requêtes dans /metrics', async () => {
    const app = buildApp({ flags: { lco_paiement_api: false } });
    await app.inject({ method: 'GET', url: '/health' });
    const res = await app.inject({ method: 'GET', url: '/metrics' });
    expect(res.json().requests).toMatchObject({ '/health 200': 1 });
  });
});
