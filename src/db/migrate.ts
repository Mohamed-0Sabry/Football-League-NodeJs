import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Determine if we're in a test environment
const isTestEnvironment = process.env.NODE_ENV === 'test';

// Create a connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: isTestEnvironment 
    ? (process.env.TEST_DB_NAME || 'football_league_test')
    : (process.env.DB_NAME || 'football_league'),
});

// Create a Drizzle instance
const db = drizzle(pool);

// Run migrations
async function runMigrations() {
  console.log(`Running migrations for ${isTestEnvironment ? 'test' : 'production'} database...`);
  
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

// Run the migrations
runMigrations(); 