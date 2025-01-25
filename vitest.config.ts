import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: './unittest/test-utils/setup.ts',
    coverage: {
      provider: 'v8'
    },
  },
})