import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup/test-setup.ts'],
    globals: true,
  },
});
