import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a connection pool for the test database
const testPool = new Pool({
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || '5432'),
  user: process.env.TEST_DB_USER || 'postgres',
  password: process.env.TEST_DB_PASSWORD || 'postgres',
  database: process.env.TEST_DB_NAME || 'football_league_test',
  ssl: process.env.TEST_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Create a connection pool for the default database (to create test database if needed)
// Only use this if you have permissions to create databases on the remote server
const defaultPool = new Pool({
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || '5432'),
  user: process.env.TEST_DB_USER || 'postgres',
  password: process.env.TEST_DB_PASSWORD || 'postgres',
  database: 'postgres', // Connect to the default postgres database
  ssl: process.env.TEST_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Create a Drizzle instance for the test database
export const testDb = drizzle(testPool, { schema });

// Function to reset the test database
export async function resetTestDatabase() {
  try {
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