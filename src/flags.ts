import { readFileSync } from 'node:fs';

/** Feature flags du starter (flags.json). Toute bascule passe par `npm run flag`, qui la trace dans le Context Nexus. */
export type Flags = Record<string, boolean>;

export function loadFlags(path = 'flags.json'): Flags {
  const raw: unknown = JSON.parse(readFileSync(path, 'utf8'));
  if (typeof raw !== 'object' || raw === null) throw new Error(`${path} : objet attendu`);
  for (const [name, value] of Object.entries(raw)) {
    if (typeof value !== 'boolean') throw new Error(`${path} : le flag ${name} doit valoir true ou false`);
  }
  return raw as Flags;
}

export function isEnabled(flags: Flags, name: string): boolean {
  return flags[name] === true;
}
