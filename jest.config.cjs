/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^smartbox-types$': '<rootDir>/src/smartbox-types',
    '^smartbox-tables$': '<rootDir>/src/smartbox-tables',
  },
  setupFiles: ['<rootDir>/test.setup.ts'],
  transform: {
    '^.+\\.tsx?$': '<rootDir>/jest-ts-transformer.cjs',
  },
};
