import 'reflect-metadata';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup/test-setup.ts'],
    globals: true,
  },
});
