import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client for server-side code:
 * - Server Components (RSC)
 * - Route Handlers (GET/POST/etc.)
 * - Server Actions
 *
 * Cookie handling is fully compatible with Next.js 14 App Router.
 * Uses the public anon key — relies on RLS for security.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll is called from Server Components where mutations are not
            // possible. The middleware handles session refresh, so this is safe.
          }
        },
      },
    }
  );
}

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client with the service-role key.
 * ONLY use this in Route Handlers / Server Actions — NEVER expose to the client.
 * Bypasses RLS entirely — use with care.
 */
export async function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
