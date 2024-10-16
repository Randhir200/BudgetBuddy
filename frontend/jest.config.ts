export default {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      "^.+\\.tsx?$": "ts-jest" // process `*.tsx` files with `ts-jest`
    },
    moduleNameMapper: {
      '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js', // Ensure no spaces in "__mocks__"
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy' // Add handling for CSS modules if needed
    },
    collectCoverage: true, // Enable coverage collection
    collectCoverageFrom: [
      "src/**/*.{js,jsx,ts,tsx}", // Include all files in the src folder for coverage
      "!src/**/*.d.ts" // Exclude type declaration files from coverage
    ],
    coverageThreshold: {
      global: {
        lines: 80, // Set coverage threshold
        statements: 80,
        functions: 80,
        branches: 80
      }
    },
    coverageReporters: ["text", "lcov"], // You can customize the output format
  };
  