/**
 * Environment variable accessors.
 * Validated lazily at first access (runtime) — not at module load or build time.
 * This lets `next build` succeed without env vars, while still failing fast
 * the first time a handler actually tries to use a missing variable.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function optionalEnv(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

// ─── Public env (safe to expose to the browser) ───────────────────────────
// Accessed via getter so validation runs at call time, not module load time.

export const env = {
  get SANITY_PROJECT_ID() { return requireEnv("NEXT_PUBLIC_SANITY_PROJECT_ID"); },
  get SANITY_DATASET() { return optionalEnv("NEXT_PUBLIC_SANITY_DATASET", "production"); },
  get SUPABASE_URL() { return requireEnv("NEXT_PUBLIC_SUPABASE_URL"); },
  get SUPABASE_ANON_KEY() { return requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"); },
  get SITE_URL() { return optionalEnv("NEXT_PUBLIC_SITE_URL", "https://pikorua.in"); },
  get GTM_ID() { return optionalEnv("NEXT_PUBLIC_GTM_ID"); },
  get GA4_MEASUREMENT_ID() { return optionalEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID"); },
  // WhatsApp contact — public so client components can build wa.me links
  get WHATSAPP_NUMBER() { return optionalEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "916354359222"); },
  get WHATSAPP_DEFAULT_MESSAGE() {
    return optionalEnv(
      "NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE",
      "Hi, I'd like to know more about luxury residences in Ahmedabad."
    );
  },
  // Set to "true" when the full site is ready to go live; gates the coming-soon page
  get SITE_LIVE() { return optionalEnv("NEXT_PUBLIC_SITE_LIVE", "false") === "true"; },
} as const;

// ─── Server-only env (never included in client bundles) ───────────────────
// Call getServerEnv() only from Route Handlers, Server Actions, or Server Components.

export function getServerEnv() {
  return {
    SUPABASE_SERVICE_ROLE_KEY: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    SANITY_API_READ_TOKEN: optionalEnv("SANITY_API_READ_TOKEN"),
    SANITY_WEBHOOK_SECRET: requireEnv("SANITY_WEBHOOK_SECRET"),
    RESEND_API_KEY: optionalEnv("RESEND_API_KEY"),
    BREVO_API_KEY: optionalEnv("BREVO_API_KEY", optionalEnv("BRAVE_API_KEY")),
    BREVO_SENDER_EMAIL: optionalEnv("BREVO_SENDER_EMAIL", "noreply@pikorua.in"),
    BREVO_SENDER_NAME: optionalEnv("BREVO_SENDER_NAME", "PIKORUA Realty"),
    TEAM_NOTIFICATION_EMAIL: optionalEnv("TEAM_NOTIFICATION_EMAIL", "connect@pikorua.in"),
    ZOHO_CRM_CLIENT_ID: optionalEnv("ZOHO_CRM_CLIENT_ID"),
    ZOHO_CRM_CLIENT_SECRET: optionalEnv("ZOHO_CRM_CLIENT_SECRET"),
    ZOHO_CRM_REFRESH_TOKEN: optionalEnv("ZOHO_CRM_REFRESH_TOKEN"),
    HUBSPOT_API_KEY: optionalEnv("HUBSPOT_API_KEY"),
    // Resend "from" address — must be a verified domain in your Resend account
    RESEND_FROM_EMAIL: optionalEnv("RESEND_FROM_EMAIL", "PIKORUA Website <noreply@pikorua.in>"),
  } as const;
}
