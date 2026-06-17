import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in browser-side code:
 * - Client Components ("use client")
 * - Event handlers, hooks, etc.
 *
 * Uses the public anon key — relies on RLS for security.
 */
export function createClient() {
  return createBrowserClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
