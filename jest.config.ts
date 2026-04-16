import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage/pxti-web-app',
  coverageReporters: ['html', 'text', 'lcov', 'clover'],
  coverageProvider: 'babel',
  roots: ['<rootDir>/src'],
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  moduleNameMapper: {},
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  testResultsProcessor: 'jest-sonar-reporter',
};
export default config;
