// This file is used to set up the test environment
// It will be executed before each test file

import * as dotenv from 'dotenv';
import { resetTestDatabase } from '../config/testDb';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Increase timeout for tests that interact with the database
// This is especially important for remote databases which may have higher latency
jest.setTimeout(parseInt(process.env.JEST_TIMEOUT || '30000'));

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  // Uncomment these if you want to suppress logs during tests
  // log: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Reset the test database before all tests
beforeAll(async () => {
  try {
    console.log('Setting up test database...');
    await resetTestDatabase();
    console.log('Test database setup complete');
  } catch (error) {
    console.error('Failed to set up test database:', error);
    throw error;
  }
}); 