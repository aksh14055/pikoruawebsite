import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-side client — uses the service role key (never exposed to browser).
// Only call inside Route Handlers, Server Actions, or Server Components.
export function createServerSupabaseClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

// Public client — anon key only; RLS denies all reads on the leads table.
// Lazy singleton so the module doesn't throw during `next build` when env
// vars are not present in the build environment.
let _publicClient: SupabaseClient | null = null;

export function getSupabasePublicClient(): SupabaseClient {
  if (!_publicClient) {
    _publicClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _publicClient;
}
