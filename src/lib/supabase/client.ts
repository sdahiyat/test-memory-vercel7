import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

/**
 * Creates a new Supabase browser client with full type safety.
 * Use this in client components ('use client') or when you need
 * a fresh client instance (e.g., SSR-safe contexts).
 */
export function createBrowserSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Singleton instance for client components
let client: ReturnType<typeof createBrowserSupabaseClient> | undefined

/**
 * Returns a singleton Supabase browser client.
 * Safe to call multiple times — reuses the same instance.
 * Use this in React client components to avoid creating multiple connections.
 */
export function getSupabaseClient() {
  if (!client) {
    client = createBrowserSupabaseClient()
  }
  return client
}
