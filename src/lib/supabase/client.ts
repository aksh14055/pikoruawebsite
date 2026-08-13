import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Public client uses only the Supabase anon key; never put service credentials here.
let publicClient: SupabaseClient | null = null;

export function getSupabasePublicClient(): SupabaseClient {
  if (!publicClient) {
    publicClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return publicClient;
}
