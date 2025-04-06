import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// For testing purposes, we'll use a mock database
// This avoids the need for a real PostgreSQL connection
let testPool: Pool;
let defaultPool: Pool;

// Store mock data
const mockData = {
  players: [],
  teams: [],
  matches: [],
  performances: [],
  notifications: [],
};

// Create mock pools for testing
if (process.env.NODE_ENV === 'test') {
  // Mock implementation for testing
  testPool = {
    query: jest.fn().mockImplementation((query, params) => {
      // Return mock data based on the query
      if (query.includes('SELECT')) {
        if (query.includes('players')) {
          return Promise.resolve({ rows: mockData.players, rowCount: mockData.players.length });
        }
        if (query.includes('teams')) {
          return Promise.resolve({ rows: mockData.teams, rowCount: mockData.teams.length });
        }
        if (query.includes('matches')) {
          return Promise.resolve({ rows: mockData.matches, rowCount: mockData.matches.length });
        }
        if (query.includes('player_performances')) {
          return Promise.resolve({ rows: mockData.performances, rowCount: mockData.performances.length });
        }
        if (query.includes('notifications')) {
          return Promise.resolve({ rows: mockData.notifications, rowCount: mockData.notifications.length });
        }
        return Promise.resolve({ rows: [], rowCount: 0 });
      }
      if (query.includes('INSERT')) {
        const table = query.match(/INSERT INTO (\w+)/)?.[1];
        const data = params?.[0] || {};
        if (table === 'players') mockData.players.push(data as never);
        if (table === 'teams') mockData.teams.push(data as never);
        if (table === 'matches') mockData.matches.push(data as never);
        if (table === 'player_performances') mockData.performances.push(data as never);
        if (table === 'notifications') mockData.notifications.push(data as never);
        return Promise.resolve({ rows: [data], rowCount: 1 });
      }
      return Promise.resolve({ rows: [], rowCount: 1 });
    }),
    end: jest.fn().mockResolvedValue(undefined),
  } as unknown as Pool;
  
  defaultPool = {
    query: jest.fn().mockImplementation((query, params) => {
      // Return mock data based on the query
      if (query.includes('SELECT')) {
        return Promise.resolve({ rows: [], rowCount: 0 });
      }
      return Promise.resolve({ rows: [], rowCount: 1 });
    }),
    end: jest.fn().mockResolvedValue(undefined),
  } as unknown as Pool;
  
  console.log('Using mock database for testing');
} else {
  // Real implementation for non-test environments
  testPool = new Pool({
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '5432'),
    user: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || 'postgres',
    database: process.env.TEST_DB_NAME || 'football_league_test',
    ssl: process.env.TEST_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  defaultPool = new Pool({
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '5432'),
    user: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || 'postgres',
    database: 'postgres', // Connect to the default postgres database
    ssl: process.env.TEST_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });
}

// Create a Drizzle instance for the test database
export const testDb = drizzle(testPool, { schema });

// Function to reset the test database
export async function resetTestDatabase() {
  try {
    if (process.env.NODE_ENV === 'test') {
      // For testing, clear the mock data
      mockData.players = [];
      mockData.teams = [];
      mockData.matches = [];
      mockData.performances = [];
      mockData.notifications = [];
      console.log('Mock: Test database reset');
      return;
    }
    
    // For remote databases, you might not have permissions to create databases
    // In that case, we'll skip the database creation step and just reset the schema
    
    // Check if we should attempt to create the database
    const shouldCreateDb = process.env.TEST_DB_CREATE === 'true';
    
    if (shouldCreateDb) {
      // Check if the test database exists
      const result = await defaultPool.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [process.env.TEST_DB_NAME || 'football_league_test']
      );
      
      // Create the test database if it doesn't exist
      if (result.rowCount === 0) {
        console.log('Creating test database...');
        await defaultPool.query(
          `CREATE DATABASE "${process.env.TEST_DB_NAME || 'football_league_test'}"`
        );
        console.log('Test database created successfully');
      }
      
      // Close the default pool connection
      await defaultPool.end();
    }
    
    // Drop all tables in the test database
    await testPool.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `);
    
    // Run migrations to recreate the schema
    await migrate(testDb, { migrationsFolder: 'drizzle' });
    console.log('Test database reset successfully');
  } catch (error) {
    console.error('Error resetting test database:', error);
    throw error;
  }
}

// Function to close the test database connection
export async function closeTestDatabase() {
  await testPool.end();
} 