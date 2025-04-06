// This file is used to set up the test environment
// It will be executed before each test file

// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.TEST_DB_NAME = 'football_league_test';

// Increase timeout for tests that interact with the database
jest.setTimeout(10000);

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  // Uncomment to suppress specific console methods during tests
  // log: jest.fn(),
  // error: jest.fn(),
  // warn: jest.fn(),
  // info: jest.fn(),
  // debug: jest.fn(),
}; 