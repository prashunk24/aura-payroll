module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@aura/types$': '<rootDir>/../../packages/types',
    '^@aura/config$': '<rootDir>/../../packages/config',
  },
};
