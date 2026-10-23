// Gate-check automatique : ce qui se vérifie sans jugement humain, avant le créneau de 5 minutes avec le gate keeper.
//   npm run gate-check -- G1   (G1 à G6)
import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { NEXUS, PORT, SQUAD, TEAM, requireNexus, green, red } from './lib.mjs';

const PCI = true;
const gate = (process.argv[2] ?? '').toUpperCase();
if (!/^G[1-6]$/.test(gate)) {
  red('Usage : npm run gate-check -- G1   (G1 à G6)');
  process.exit(2);
}
requireNexus();

const results = [];
const check = (id, label, ok, hint = '') => results.push({ id, label, ok: Boolean(ok), hint });

function frontmatter(path) {
  const m = readFileSync(path, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  return Object.fromEntries(m[1].split('\n').map((l) => l.match(/^([\w-]+):\s*(.*?)\s*(#.*)?$/)).filter(Boolean).map((x) => [x[1], x[2]]));
}
const filled = (v) => v && v !== 'null' && !v.startsWith('<');
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
const run = (cmd) => { try { execSync(cmd, { stdio: 'pipe' }); return true; } catch { return false; } };
const contextOk = () => run(`node "${resolve(NEXUS, 'tools/context-assemble.mjs')}" --squad ${SQUAD} --check`);
const mdFiles = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => resolve(dir, f)) : []);

if (gate === 'G1') {
  const p = resolve(TEAM, 'intent/business-intent.md');
  const fm = existsSync(p) ? frontmatter(p) : {};
  check('G1-1', 'Business Intent Spec publiée', existsSync(p), `copier gabarits/business-intent.md dans teams/${SQUAD}/intent/`);
  check('G1-2', 'statut active et owner nommé', fm.status === 'active' && filled(fm.owner));
  check('G1-3', 'contexte daté (last-validated)', filled(fm['last-validated']));
  const body = read(p);
  const sections = ['## 1.', '## 2.', '## 3.', '## 4.', '## 5.'].map((h) => {
    const after = body.split(h)[1] ?? '';
    const text = after.split(/\n## /)[0].split('\n').slice(1).join('\n').trim();
    return text.length > 0 && !text.startsWith('<');
  });
  check('G1-4', '5 champs remplis', sections.every(Boolean), `champs vides : ${sections.map((ok, i) => (ok ? '' : i + 1)).filter(Boolean).join(', ')}`);
  check('G1-5', 'critère de succès chiffré (champ 3)', sections[2] && /\d/.test((body.split('## 3.')[1] ?? '').split(/\n## /)[0]));
}

if (gate === 'G2') {
  const specs = mdFiles(resolve(TEAM, 'intent/specs')).map(frontmatter);
  check('G2-1', 'spec publiée dans intent/specs/', specs.length > 0, 'voir gabarits/frontmatter-spec.md');
  check('G2-2', 'spec active avec owner', specs.some((f) => f.status === 'active' && filled(f.owner)));
  const contracts = mdFiles(resolve(TEAM, 'contracts')).map((p) => [p, frontmatter(p)]);
  check('G2-3', 'contrats publiés en v1 (≥ 1.0.0)', contracts.length > 0 && contracts.every(([, f]) => Number((f.version ?? '0').split('.')[0]) >= 1),
    contracts.filter(([, f]) => Number((f.version ?? '0').split('.')[0]) < 1).map(([p]) => p.split('/').pop()).join(', '));
  check('G2-4', 'versions épinglées à jour (context-assemble --check)', contextOk(), 'npm run context, puis lire la sortie');
}

if (gate === 'G3') {
  check('G3-1', 'lint (ENG-01)', run('npm run lint'));
  check('G3-2', 'typecheck', run('npm run typecheck'));
  check('G3-3', 'tests et couverture ≥ 70 % (ENG-02, ENG-03)', run('npm run test:coverage'));
  check('G3-4', 'scan PCI et secrets (SEC-01, SEC-04)', run('npm run scan'));
  check('G3-5', 'dépendances sans vulnérabilité haute (SEC-03)', run('npm audit --audit-level=high'));
  check('G3-6', 'spec à jour, rien de stale (context-assemble --check)', contextOk());
  if (PCI) {
    const log = (() => { try { return execSync('git log --format=%B -- src', { encoding: 'utf8' }); } catch { return ''; } })();
    check('G3-7', 'signature humaine sur le code de débit (SEC-02, PCI-03)', /^Signed-off-by: .+/m.test(log), 'git commit -s par le Decision Guarantor');
  }
}

if (gate === 'G4') {
  const flags = JSON.parse(readFileSync('flags.json', 'utf8'));
  const journal = read(resolve(TEAM, 'operations/flags-journal.md'));
  const untraced = Object.entries(flags).filter(([n, on]) => on && !new RegExp(`\\| ${n} \\| on \\|`).test(journal)).map(([n]) => n);
  check('G4-1', 'flags activés tracés dans le journal (ENG-05)', untraced.length === 0, `sans trace : ${untraced.join(', ')} — utiliser npm run flag`);
  const runbook = read(resolve(TEAM, 'operations/runbook.md'));
  check('G4-2', 'runbook publié', runbook.length > 0, 'copier gabarits/runtime-spec.md dans operations/runbook.md');
  check('G4-3', 'runbook : owner d\'exploitation et rollback', /owner/i.test(runbook) && /rollback/i.test(runbook));
  check('G4-4', `service déployé et observable (port ${PORT})`, run('node scripts/observe.mjs'), 'npm run deploy');
}

if (gate === 'G5') {
  const p = resolve(TEAM, 'intent/opportunity.md');
  const body = read(p);
  check('G5-1', 'Opportunity Spec publiée', body.length > 0, 'copier gabarits/opportunity-spec.md');
  check('G5-2', 'un seul verdict coché', (body.match(/^- \[x\]/gim) ?? []).length === 1);
}

if (gate === 'G6') {
  const body = read(resolve(TEAM, 'intent/retirement.md'));
  check('G6-1', 'Retirement Spec publiée', body.length > 0, 'copier gabarits/retirement-spec.md');
  const rows = (body.split('## Carte des dépendances')[1] ?? '').split(/\n## /)[0].split('\n').filter((l) => /^\|/.test(l) && !/^\|[-| ]+\|$/.test(l)).slice(1);
  check('G6-2', 'carte des dépendances : chaque ligne a sa disposition', rows.length > 0 && rows.every((r) => /migrer|garder|supprimer/i.test(r)));
}

console.log(`\nGate-check ${gate} · ${SQUAD}\n`);
for (const r of results) (r.ok ? green : red)(`${r.ok ? '✓' : '✗'} ${r.id}  ${r.label}${!r.ok && r.hint ? `  → ${r.hint}` : ''}`);
const ko = results.filter((r) => !r.ok).length;
console.log(ko ? `\n${ko} critère(s) à corriger avant le créneau.` : '\nPrêt pour le gate keeper.');
process.exit(ko ? 1 : 0);
