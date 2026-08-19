import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/specs/**/*.spec.js', 'test/rules/**/*.spec.js'],
    testTimeout: 60000,
    fileParallelism: false,
    pool: 'forks',
    forks: { singleFork: true }
  }
})
