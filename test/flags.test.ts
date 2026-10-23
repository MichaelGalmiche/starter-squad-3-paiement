import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { isEnabled, loadFlags } from '../src/flags.js';

function file(content: string): string {
  const path = join(mkdtempSync(join(tmpdir(), 'flags-')), 'flags.json');
  writeFileSync(path, content);
  return path;
}

describe('flags', () => {
  it('lit flags.json', () => {
    expect(isEnabled(loadFlags(file('{"a": true, "b": false}')), 'a')).toBe(true);
  });
  it('considère un flag inconnu comme désactivé', () => {
    expect(isEnabled(loadFlags(file('{}')), 'absent')).toBe(false);
  });
  it('refuse une valeur non booléenne', () => {
    expect(() => loadFlags(file('{"a": "on"}'))).toThrow(/true ou false/);
  });
});
