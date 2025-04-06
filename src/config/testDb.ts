import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

// Create a connection pool for the test database
const testPool = new Pool({
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || '5432'),
  user: process.env.TEST_DB_USER || 'postgres',
  password: process.env.TEST_DB_PASSWORD || 'postgres',
  database: process.env.TEST_DB_NAME || 'football_league_test',
});

// Create a Drizzle instance for the test database
export const testDb = drizzle(testPool, { schema });

// Function to reset the test database
export async function resetTestDatabase() {
  // Drop all tables in the test database
  await testPool.query(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    GRANT ALL ON SCHEMA public TO postgres;
    GRANT ALL ON SCHEMA public TO public;
  `);
  
  // Run migrations to recreate the schema
  await migrate(testDb, { migrationsFolder: 'drizzle' });
}

// Function to close the test database connection
export async function closeTestDatabase() {
  await testPool.end();
} 