import { Pool } from 'pg';
import { Redis } from 'ioredis';
import { EventBus, getEventBus } from './events/event-bus';

// ============================================================================
// DATABASE CONNECTION MANAGEMENT
// ============================================================================

/**
 * Postgres connection pool with enhanced configuration
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'remotone',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * Redis connection with enhanced configuration
 */
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// ============================================================================
// CONNECTION HEALTH CHECKS
// ============================================================================

/**
 * Check PostgreSQL connection health
 */
export async function checkPostgresHealth(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('PostgreSQL health check failed:', error);
    return false;
  }
}

/**
 * Check Redis connection health
 */
export async function checkRedisHealth(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
}

/**
 * Check all database connections health
 */
export async function checkDatabaseHealth(): Promise<{
  postgres: boolean;
  redis: boolean;
  overall: boolean;
}> {
  const [postgres, redis] = await Promise.all([
    checkPostgresHealth(),
    checkRedisHealth()
  ]);

  return {
    postgres,
    redis,
    overall: postgres && redis
  };
}

// ============================================================================
// CONNECTION MANAGEMENT
// ============================================================================

/**
 * Gracefully shutdown database connections
 */
export async function shutdownDatabaseConnections(): Promise<void> {
  try {
    await Promise.all([
      pool.end(),
      redis.quit()
    ]);
    console.log('Database connections closed successfully');
  } catch (error) {
    console.error('Error closing database connections:', error);
    throw error;
  }
}

/**
 * Get event bus instance with Redis connection
 */
export function getEventBusInstance(): EventBus {
  return getEventBus(redis);
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Handle database errors with proper logging
 */
export function handleDatabaseError(error: unknown, context: string): void {
  console.error(`Database error in ${context}:`, error);

  // Emit error event if event bus is available
  try {
    const eventBus = getEventBusInstance();
    // You could emit a system error event here
  } catch (error) {
    // Event bus might not be initialized yet
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export { pool, redis };
export type { Pool } from 'pg';
export type { Redis } from 'ioredis';
