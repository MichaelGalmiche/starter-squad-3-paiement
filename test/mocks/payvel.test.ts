import { describe, expect, it } from 'vitest';
import { capture, maskToken } from '../../src/mocks/payvel.js';

describe('mock PayVel', () => {
  it('capture, refuse et tombe en panne selon le jeton', () => {
    expect(capture('pvt_tok_ok1234', 3500, 'EUR').status).toBe('CAPTURED');
    expect(capture('pvt_tok_decline', 3500, 'EUR').status).toBe('DECLINED');
    expect(capture('pvt_tok_error', 3500, 'EUR').status).toBe('ERROR');
    expect(capture('bad', 3500, 'EUR').status).toBe('ERROR');
  });
  it('masque le jeton', () => {
    expect(maskToken('pvt_tok_ok1234')).toBe('pvt_to…');
  });
});
