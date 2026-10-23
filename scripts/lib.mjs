import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

export const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
export const SQUAD = pkg.config.squad;
export const PORT = Number(process.env.PORT ?? pkg.config.port);
/** Le Context Nexus est cloné à côté du starter (surchargeable par NEXUS_DIR). */
export const NEXUS = resolve(process.env.NEXUS_DIR ?? '../context-nexus');
export const TEAM = resolve(NEXUS, 'teams', SQUAD);

export const green = (t) => console.log(`\x1b[32m${t}\x1b[0m`);
export const red = (t) => console.log(`\x1b[31m${t}\x1b[0m`);

export function requireNexus() {
  if (!existsSync(resolve(NEXUS, 'tools/context-assemble.mjs'))) {
    red(`Context Nexus introuvable dans ${NEXUS}. Clonez-le à côté du starter (voir la fiche de démarrage).`);
    process.exit(2);
  }
}

export function gitUser() {
  try { return execFileSync('git', ['config', 'user.name'], { encoding: 'utf8' }).trim() || process.env.USER || 'inconnu'; }
  catch { return process.env.USER ?? process.env.USERNAME ?? 'inconnu'; }
}

/** Date ISO 8601 locale avec décalage horaire (org/rules.md, règle 4). */
export function nowIso(date = new Date()) {
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const pad = (n) => String(Math.trunc(Math.abs(n))).padStart(2, '0');
  const local = new Date(date.getTime() + offset * 60000).toISOString().slice(0, 19);
  return `${local}${sign}${pad(offset / 60)}:${pad(offset % 60)}`;
}
