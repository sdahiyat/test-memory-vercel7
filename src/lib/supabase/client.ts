import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types'

/**
 * Creates a Supabase client for use in browser/client components.
 * Call this function inside components — do not store as a module-level singleton
 * to avoid SSR/hydration issues.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
