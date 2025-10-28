import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // Use 'jsdom' if testing React components
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      exclude: [
        'postcss.config.js',
        'tailwind.config.js',
        'eslint.config.js',
        'vite.config.ts',
        'vitest.config.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, './src/domain'),
      '@adapters': path.resolve(__dirname, './src/adapters'),
      '@application': path.resolve(__dirname, './src/application'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@presentation': path.resolve(__dirname, './src/presentation'),
    },
  },
});
