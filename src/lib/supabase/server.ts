import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

/**
 * Creates a standard server-side Supabase client using the anon key.
 * Respects Row Level Security (RLS) policies.
 *
 * Use this in:
 * - Server Components
 * - API Route Handlers (when acting on behalf of a user)
 * - Server Actions
 */
export function createServerSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Creates an admin Supabase client using the service role key.
 *
 * ⚠️  WARNING: This client BYPASSES all Row Level Security (RLS) policies.
 * It has full access to all data in the database.
 *
 * ONLY use this in:
 * - Trusted server-side API routes (never in client components)
 * - Server Actions that require elevated privileges
 * - Background jobs or webhooks
 * - Administrative operations (e.g., seeding data, migrations)
 *
 * NEVER expose this client or the service role key to the browser.
 */
export function createAdminSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
