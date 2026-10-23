// SEC-01 et SEC-04 : aucune donnée de carte ni aucun secret dans le code, les tests et les données.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { green, red } from './lib.mjs';

const DIRS = ['src', 'test', 'data'];
const RULES = [
  { id: 'SEC-01', label: 'champ de carte', re: /\b(pan|cardNumber|card_number|cvv|cvc|cardExpiry|expiryDate)\b/i },
  { id: 'SEC-04', label: 'clé Anthropic', re: /sk-ant-[A-Za-z0-9_-]{10,}/ },
  { id: 'SEC-04', label: 'clé privée', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { id: 'SEC-04', label: 'clé AWS', re: /AKIA[0-9A-Z]{16}/ },
];
const luhn = (digits) => {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return sum % 10 === 0;
};

const files = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? files(p) : [p];
});

let findings = 0;
for (const file of DIRS.flatMap((d) => { try { return files(d); } catch { return []; } })) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    for (const rule of RULES) {
      if (rule.re.test(line)) { red(`✗ ${rule.id} ${rule.label} : ${file}:${i + 1}`); findings++; }
    }
    for (const m of line.matchAll(/\b\d{13,19}\b/g)) {
      if (luhn(m[0])) { red(`✗ SEC-01 numéro ressemblant à une carte : ${file}:${i + 1}`); findings++; }
    }
  });
}
if (findings) process.exit(1);
green('✓ Aucun champ de carte ni secret détecté (SEC-01, SEC-04)');
