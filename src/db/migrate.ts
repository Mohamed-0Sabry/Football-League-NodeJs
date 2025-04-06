import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Determine if we're in a test environment
const isTestEnvironment = process.env.NODE_ENV === 'test';
const dbName = isTestEnvironment 
  ? (process.env.TEST_DB_NAME || 'football_league_test')
  : (process.env.DB_NAME || 'football_league');

// SSL configuration for remote databases
const sslConfig = process.env.DB_SSL === 'true' 
  ? { rejectUnauthorized: false } 
  : false;

// Create a connection pool to the default postgres database
const defaultPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: 'postgres', // Connect to the default postgres database
  ssl: sslConfig,
});

// Function to create the database if it doesn't exist
async function createDatabaseIfNotExists() {
  try {
    // Check if we should attempt to create the database
    const shouldCreateDb = process.env.DB_CREATE === 'true';
    
    if (!shouldCreateDb) {
      console.log('Database creation skipped as DB_CREATE is not set to true');
      return;
    }
    
    // Check if the database exists
    const result = await defaultPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );
    
    // Create the database if it doesn't exist
    if (result.rowCount === 0) {
      console.log(`Creating database '${dbName}'...`);
      await defaultPool.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database '${dbName}' created successfully`);
    } else {
      console.log(`Database '${dbName}' already exists`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    // Close the default pool connection
    await defaultPool.end();
  }
}

// Create a connection pool to the target database
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: dbName,
  ssl: sslConfig,
});

// Create a Drizzle instance
const db = drizzle(pool, { schema: {} });

// Run migrations
async function runMigrations() {
  console.log(`Running migrations for ${isTestEnvironment ? 'test' : 'production'} database '${dbName}'...`);
  
  try {
    // First, create the database if it doesn't exist
    await createDatabaseIfNotExists();
    
    // Then run the migrations
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