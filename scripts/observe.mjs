// Lit la santé et les métriques du service déployé (G4 : observabilité).
import { PORT, green, red } from './lib.mjs';

try {
  const health = await (await fetch(`http://localhost:${PORT}/health`)).json();
  const metrics = await (await fetch(`http://localhost:${PORT}/metrics`)).json();
  green(`✓ ${health.squad} répond sur le port ${PORT}`);
  console.log('Flags     :', JSON.stringify(health.flags));
  console.log('Démarré   :', metrics.startedAt);
  console.log('Requêtes  :', JSON.stringify(metrics.requests, null, 2));
} catch {
  red(`✗ Aucun service sur le port ${PORT} : lancez npm run deploy`);
  process.exit(1);
}
