/**
 * Mock du PSP fictif PayVel. Nos services ne voient jamais de donnée de carte : seulement un jeton (PCI-01).
 * Le jeton `pvt_tok_decline` simule un refus, `pvt_tok_error` une panne.
 */
export type PayVelResult =
  | { status: 'CAPTURED'; transactionId: string }
  | { status: 'DECLINED'; reason: string }
  | { status: 'ERROR'; reason: string };

export function capture(paymentToken: string, amountMinor: number, currency: 'EUR'): PayVelResult {
  if (!paymentToken.startsWith('pvt_tok_')) return { status: 'ERROR', reason: 'INVALID_TOKEN' };
  if (paymentToken === 'pvt_tok_decline') return { status: 'DECLINED', reason: 'INSUFFICIENT_FUNDS' };
  if (paymentToken === 'pvt_tok_error') return { status: 'ERROR', reason: 'PSP_UNAVAILABLE' };
  return { status: 'CAPTURED', transactionId: `pv_${currency}_${amountMinor}_${paymentToken.slice(-6)}` };
}

/** Tronque un jeton pour les logs (PCI-02). */
export function maskToken(paymentToken: string): string {
  return `${paymentToken.slice(0, 6)}…`;
}
