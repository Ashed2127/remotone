// @ts-ignore - Clerk SDK is optional for this module
let clerk: any = null;
try {
  const { Clerk } = require('@clerk/clerk-sdk-node');
  clerk = new Clerk(process.env.CLERK_SECRET_KEY);
} catch (e) {
  console.warn('Clerk SDK not available');
}

import { handleAgentError } from './agent-error-handler';

export interface AuthUser {
  id: string;
  clerkUserId: string;
  email: string;
  orgId?: string;
}

/**
 * Get current user from request
 */
export async function getCurrentUser(request: Request): Promise<AuthUser | null> {
  try {
    // In a real implementation, this would validate the JWT token from Clerk
    // For now, we'll implement a basic version

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);

    // Verify token with Clerk
    const payload = await clerk.verifyToken(token);

    // Get user from database
    const { pool } = await import('./db');
    const result = await pool.query(
      'SELECT * FROM users WHERE clerk_user_id = $1',
      [payload.sub]
    );

    if (result.rows.length === 0) {
      // Create user if not exists
      const newUser = await pool.query(
        `INSERT INTO users (clerk_user_id, email)
         VALUES ($1, $2)
         RETURNING *`,
        [payload.sub, payload.email || '']
      );

      return {
        id: newUser.rows[0].id,
        clerkUserId: newUser.rows[0].clerk_user_id,
        email: newUser.rows[0].email,
      };
    }

    const user = result.rows[0];
    return {
      id: user.id,
      clerkUserId: user.clerk_user_id,
      email: user.email,
      orgId: user.org_id,
    };
  } catch (error) {
    const agentError = handleAgentError(error);
    console.error('Auth error:', agentError);
    return null;
  }
}

/**
 * Sync user from Clerk webhook
 */
export async function syncUserFromClerk(clerkUserId: string, email: string): Promise<void> {
  try {
    const { pool } = await import('./db');

    await pool.query(
      `INSERT INTO users (clerk_user_id, email)
       VALUES ($1, $2)
       ON CONFLICT (clerk_user_id)
       DO UPDATE SET email = $2, updated_at = CURRENT_TIMESTAMP`,
      [clerkUserId, email]
    );
  } catch (error) {
    const agentError = handleAgentError(error);
    console.error('User sync error:', agentError);
    throw error;
  }
}

/**
 * Sync organization from Clerk webhook
 */
export async function syncOrgFromClerk(clerkOrgId: string, name: string): Promise<void> {
  try {
    const { pool } = await import('./db');

    await pool.query(
      `INSERT INTO organizations (clerk_org_id, name)
       VALUES ($1, $2)
       ON CONFLICT (clerk_org_id)
       DO UPDATE SET name = $2, updated_at = CURRENT_TIMESTAMP`,
      [clerkOrgId, name]
    );
  } catch (error) {
    const agentError = handleAgentError(error);
    console.error('Organization sync error:', agentError);
    throw error;
  }
}

/**
 * Set user's organization
 */
export async function setUserOrg(userId: string, orgId: string): Promise<void> {
  try {
    const { pool } = await import('./db');

    await pool.query(
      `UPDATE users
       SET org_id = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [orgId, userId]
    );
  } catch (error) {
    const agentError = handleAgentError(error);
    console.error('Set user org error:', agentError);
    throw error;
  }
}
