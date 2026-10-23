import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts'],
      // ENG-03 : couverture des lignes du code nouveau ≥ 70 % (dry run)
      thresholds: { lines: 70 },
    },
  },
});
