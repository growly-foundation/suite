import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      TZ: 'UTC',
    },
    coverage: {
      exclude: [
        '**.js',
        '**.ts',
        '**/**.stories.**',
        '**/index.ts',
        '**/mocks.tsx',
        '**/*Svg.tsx',
        '**/types.ts',
        '.storybook/**',
        '.yarn/**',
        'esm/**',
        'node_modules/**',
        'widgets/esm/**',
        '**/**.test.tsx',
      ],
      reportOnFailure: true,
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    environment: 'jsdom',
    exclude: ['**/node_modules/**'],
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
});
