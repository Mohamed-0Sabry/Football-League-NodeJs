// This file is used to set up the test environment
// It will be executed before each test file

import * as dotenv from 'dotenv';
import { resetTestDatabase } from '../config/testDb';

// Load environment variables
dotenv.config();

// Set test environment
process.env.NODE_ENV = 'test';

// Increase timeout for tests that interact with the database
// This is especially important for remote databases which may have higher latency
jest.setTimeout(parseInt(process.env.JEST_TIMEOUT || '30000'));

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Export a function to reset the database
export async function setupTestDatabase() {
  try {
    console.log('Setting up database for testing...');
    await resetTestDatabase();
    console.log('Database setup complete');
  } catch (error) {
    console.error('Failed to set up database:', error);
    throw error;
  }
} 