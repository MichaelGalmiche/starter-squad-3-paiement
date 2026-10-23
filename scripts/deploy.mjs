// Déploiement local du starter : build, arrêt de l'instance précédente, démarrage en arrière-plan, sonde de santé.
import { execSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, openSync, readFileSync, writeFileSync } from 'node:fs';
import { PORT, SQUAD, green, red, nowIso } from './lib.mjs';

mkdirSync('.run', { recursive: true });
execSync('npm run build', { stdio: 'inherit' });

if (existsSync('.run/server.pid')) {
  const previous = Number(readFileSync('.run/server.pid', 'utf8'));
  try { process.kill(previous); console.log(`Instance précédente arrêtée (pid ${previous})`); } catch { /* déjà arrêtée */ }
}
const log = openSync('.run/server.log', 'a');
const child = spawn(process.execPath, ['dist/index.js'], { detached: true, stdio: ['ignore', log, log], env: { ...process.env, PORT: String(PORT) } });
child.unref();
writeFileSync('.run/server.pid', String(child.pid));

for (let i = 0; i < 20; i++) {
  await new Promise((r) => setTimeout(r, 250));
  try {
    const res = await fetch(`http://localhost:${PORT}/health`);
    if (res.ok) {
      const health = await res.json();
      writeFileSync('.run/deploy.json', JSON.stringify({ deployedAt: nowIso(), squad: SQUAD, port: PORT, flags: health.flags }, null, 2));
      green(`Déployé : http://localhost:${PORT} (flags : ${JSON.stringify(health.flags)})`);
      process.exit(0);
    }
  } catch { /* pas encore prêt */ }
}
red('Le service ne répond pas sur /health : voir .run/server.log');
process.exit(1);
