import { pool } from '../src/lib/db';
import { readFileSync } from 'fs';
import { join } from 'path';

async function initDatabase() {
  try {
    console.log('Initializing database...');
    
    const schemaPath = join(__dirname, '../schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    
    await pool.query(schema);
    
    console.log('Database initialized successfully!');
    console.log('Tables created: organizations, users, projects, timelines, assets, render_jobs, usage_records');
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
