// Bascule un feature flag ET la trace dans le journal de flags du Context Nexus (procédure programme/feature-flags.md).
//   npm run flag -- <nom> on|off --reason "pourquoi"
import { readFileSync, writeFileSync, existsSync, appendFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { SQUAD, TEAM, requireNexus, gitUser, nowIso, green, red } from './lib.mjs';

const args = process.argv.slice(2);
const reasonIndex = args.indexOf('--reason');
const reason = reasonIndex >= 0 ? args[reasonIndex + 1] : undefined;
const [name, state] = args.filter((_, i) => i !== reasonIndex && i !== reasonIndex + 1);

if (!name || !['on', 'off'].includes(state) || !reason) {
  red('Usage : npm run flag -- <nom> on|off --reason "pourquoi"');
  process.exit(2);
}
const flags = JSON.parse(readFileSync('flags.json', 'utf8'));
if (!(name in flags)) {
  red(`Flag inconnu : ${name}. Flags déclarés dans flags.json : ${Object.keys(flags).join(', ')}`);
  process.exit(2);
}
requireNexus();

const journal = resolve(TEAM, 'operations/flags-journal.md');
if (!existsSync(journal)) {
  mkdirSync(resolve(TEAM, 'operations'), { recursive: true });
  writeFileSync(journal, `---
id: ${SQUAD}/flags-journal
register: operations
level: team
owner: ${SQUAD}
status: active
version: 1.0.0
last-validated: ${nowIso().slice(0, 10)}
consumption-mode: rag
---

# Journal de flags · ${SQUAD}

| Date | Flag | État | Qui | Motif |
|---|---|---|---|---|
`);
}
appendFileSync(journal, `| ${nowIso()} | ${name} | ${state} | ${gitUser()} | ${reason.replaceAll('|', '/')} |\n`);
flags[name] = state === 'on';
writeFileSync('flags.json', JSON.stringify(flags, null, 2) + '\n');

green(`Flag ${name} → ${state}, tracé dans ${journal}`);
console.log('Pensez à publier le journal dans le Context Nexus (ou demandez à Claude « Publie mes changements »),');
console.log('puis redéployez (npm run deploy) pour que le service prenne le flag en compte.');
