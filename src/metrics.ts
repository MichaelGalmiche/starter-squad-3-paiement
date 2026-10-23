/** Compteurs minimaux pour l'observabilité de G4 : requêtes par route et par statut. */
export class Metrics {
  private readonly counters = new Map<string, number>();
  private readonly startedAt = new Date();

  record(route: string, status: number): void {
    const key = `${route} ${status}`;
    this.counters.set(key, (this.counters.get(key) ?? 0) + 1);
  }

  snapshot() {
    return {
      startedAt: this.startedAt.toISOString(),
      requests: Object.fromEntries([...this.counters.entries()].sort()),
    };
  }
}
