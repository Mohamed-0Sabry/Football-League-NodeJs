import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Determine if we're in a test environment
const isTestEnvironment = process.env.NODE_ENV === 'test';

// SSL configuration for remote databases
const sslConfig = process.env.DB_SSL === 'true' 
  ? { rejectUnauthorized: false } 
  : false;

// Create a connection pool
let pool: Pool;

if (isTestEnvironment) {
  // Mock pool for testing
  pool = {
    query: jest.fn().mockImplementation((query, params) => {
      // Return mock data based on the query
      if (query.includes('SELECT')) {
        return Promise.resolve({ rows: [], rowCount: 0 });
      }
      return Promise.resolve({ rows: [], rowCount: 1 });
    }),
    end: jest.fn().mockResolvedValue(undefined),
  } as unknown as Pool;
} else {
  // Real pool for non-test environments
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'football_league',
    ssl: sslConfig,
  });
}

// Create a Drizzle instance
export const db = drizzle(pool, { schema });

// Function to test the database connection
export async function testConnection(): Promise<boolean> {
  try {
    if (isTestEnvironment) {
      return true;
    }
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
} 