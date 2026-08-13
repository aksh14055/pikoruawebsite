import { getLeadDeliveryEnv } from '@/lib/server-env';

/**
 * Sends a notification email via Brevo, falling back to Resend if Brevo
 * fails or isn't configured. Shared by the leads pipeline and the
 * automated blog drafting pipeline so both use one delivery path.
 */
export async function sendNotificationEmail(opts: {
  subject: string;
  html: string;
  to?: string;
}): Promise<'brevo' | 'resend'> {
  const serverEnv = getLeadDeliveryEnv();
  const to = opts.to || serverEnv.TEAM_NOTIFICATION_EMAIL;

  if (serverEnv.BREVO_API_KEY) {
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": serverEnv.BREVO_API_KEY,
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: serverEnv.BREVO_SENDER_NAME,
            email: serverEnv.BREVO_SENDER_EMAIL,
          },
          to: [{ email: to }],
          subject: opts.subject,
          htmlContent: opts.html,
        }),
      });

      if (!res.ok) {
        throw new Error(`Brevo SMTP API status ${res.status}: ${await res.text()}`);
      }
      return 'brevo';
    } catch (err) {
      console.error("[email] Brevo send failed:", err);
      // Fall through to Resend if also present
    }
  }

  if (serverEnv.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serverEnv.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: serverEnv.RESEND_FROM_EMAIL,
          to: [to],
          subject: opts.subject,
          html: opts.html,
        }),
      });

      if (!res.ok) {
        throw new Error(`Resend ${res.status}`);
      }
      return 'resend';
    } catch (err) {
      console.error("[email] Resend send failed:", err);
    }
  }
  throw new Error('No email provider could deliver the notification');
}
