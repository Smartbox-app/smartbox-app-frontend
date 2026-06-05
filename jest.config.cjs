/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['<rootDir>/test.setup.ts'],
  transform: {
    '^.+\\.tsx?$': '<rootDir>/jest-ts-transformer.cjs',
  },
};
