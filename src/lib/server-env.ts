import "server-only";

function optionalEnv(name: string, fallback = "") {
  return process.env[name] ?? fallback;
}

export function getLeadDeliveryEnv() {
  return {
    RESEND_API_KEY: optionalEnv("RESEND_API_KEY"),
    BREVO_API_KEY: optionalEnv("BREVO_API_KEY"),
    BREVO_SENDER_EMAIL: optionalEnv("BREVO_SENDER_EMAIL", "noreply@pikorua.in"),
    BREVO_SENDER_NAME: optionalEnv("BREVO_SENDER_NAME", "PIKORUA Realty"),
    BREVO_LIST_IDS: optionalEnv("BREVO_LIST_IDS"),
    TEAM_NOTIFICATION_EMAIL: optionalEnv("ADMIN_EMAIL", optionalEnv("TEAM_NOTIFICATION_EMAIL", "connect@pikorua.in")),
    RESEND_FROM_EMAIL: optionalEnv("RESEND_FROM_EMAIL", "PIKORUA Website <noreply@pikorua.in>"),
    ZOHO_CRM_REFRESH_TOKEN: optionalEnv("ZOHO_CRM_REFRESH_TOKEN"),
    HUBSPOT_API_KEY: optionalEnv("HUBSPOT_API_KEY"),
  } as const;
}
