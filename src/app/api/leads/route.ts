import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  discoverySchema,
  propertyEnquirySchema,
  callbackSchema,
  consultationSchema,
  contactSchema,
} from "@/lib/validations/lead";
import { createServerSupabaseClient } from "@/lib/supabase/client";
import { getServerEnv } from "@/lib/env";
import { getClientIdentifier, leadRateLimit } from "@/lib/rate-limit";
import type { LeadSource } from "@/types";

// Map of source → Zod schema
const SCHEMAS: Record<string, typeof discoverySchema> = {
  discovery: discoverySchema as never,
  enquiry: propertyEnquirySchema as never,
  callback: callbackSchema as never,
  consultation: consultationSchema as never,
  contact: contactSchema as never,
};

export async function POST(req: NextRequest) {
  // ── Rate limiting ──────────────────────────────────────────────────────
  const ip = getClientIdentifier(req);
  const rl = leadRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
      }
    );
  }

  // ── Parse body ─────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const source = (raw.source ?? "contact") as LeadSource;

  // ── Honeypot check ─────────────────────────────────────────────────────
  if (raw.honeypot && String(raw.honeypot).length > 0) {
    // Silent success to bot — don't reveal we detected it
    return NextResponse.json({ ok: true });
  }

  // ── Zod validation ─────────────────────────────────────────────────────
  const schema = SCHEMAS[source];
  if (!schema) {
    return NextResponse.json({ error: "Unknown submission source" }, { status: 400 });
  }

  let data: ReturnType<typeof schema.parse>;
  try {
    data = schema.parse(raw);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", fields: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    throw err;
  }

  // ── Write to Supabase ──────────────────────────────────────────────────
  let leadId: string;
  try {
    const serverEnv = getServerEnv();
    const supabase = createServerSupabaseClient();
    void serverEnv; // used implicitly via createServerSupabaseClient env vars

    const leadRow = {
      source,
      name: (data as { name: string }).name,
      phone: (data as { phone: string }).phone,
      whatsapp: (data as { whatsapp?: string }).whatsapp ?? null,
      email: (data as { email?: string }).email ?? null,
      category: (data as { category?: string }).category ?? null,
      location: (data as { locations?: string[] }).locations?.[0] ?? null,
      budget_band: (data as { budgetBand?: string }).budgetBand ?? null,
      purpose: (data as { purpose?: string }).purpose ?? null,
      timeline: (data as { timeline?: string }).timeline ?? null,
      preferred_callback_time:
        (data as { preferredCallbackTime?: string }).preferredCallbackTime ?? null,
      property_ref: (data as { propertyRef?: string }).propertyRef ?? null,
      message: (data as { message?: string }).message ?? null,
      utm: (data as { utm?: Record<string, string> }).utm ?? null,
      consent: true,
    };

    const { data: inserted, error } = await supabase
      .from("leads")
      .insert(leadRow)
      .select("id")
      .single();

    if (error) throw error;
    leadId = inserted.id as string;

    // Audit trail
    await supabase.from("lead_events").insert({
      lead_id: leadId,
      type: "created",
      payload: { source, ip },
    });
  } catch (err) {
    console.error("[leads/route] Supabase write failed:", err);
    return NextResponse.json(
      { error: "Could not save your enquiry. Please try again or contact us directly." },
      { status: 500 }
    );
  }

  // ── Side effects (non-blocking) ────────────────────────────────────────
  // These run after the response is sent; failures are logged but don't
  // affect the user's confirmation.
  void runSideEffects(leadId, source, data as Record<string, unknown>);

  return NextResponse.json({ ok: true, leadId });
}

async function runSideEffects(
  leadId: string,
  source: string,
  data: Record<string, unknown>
) {
  const serverEnv = getServerEnv();

  await Promise.allSettled([
    notifyTeamEmail(serverEnv, leadId, source, data),
    pushToCrm(serverEnv, leadId, data),
  ]);
}

async function notifyTeamEmail(
  serverEnv: ReturnType<typeof getServerEnv>,
  leadId: string,
  source: string,
  data: Record<string, unknown>
) {
  const subject = `New ${source} lead — ${data.name ?? "Unknown"}`;
  
  // Format details beautifully for email
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #fafafa;">
      <h2 style="color: #c5a880; border-bottom: 2px solid #c5a880; padding-bottom: 10px; margin-top: 0;">New Lead Submission — PIKORUA Realty</h2>
      <p style="font-size: 14px; color: #333;">A new lead has been submitted on the website.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr style="background-color: #f2f2f2;">
          <td style="padding: 8px; font-weight: bold; width: 150px; font-size: 13px;">Lead ID:</td>
          <td style="padding: 8px; font-size: 13px;">${leadId}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; font-size: 13px;">Source:</td>
          <td style="padding: 8px; font-size: 13px; text-transform: capitalize;">${source}</td>
        </tr>
        <tr style="background-color: #f2f2f2;">
          <td style="padding: 8px; font-weight: bold; font-size: 13px;">Name:</td>
          <td style="padding: 8px; font-size: 13px;">${data.name ?? "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; font-size: 13px;">Phone:</td>
          <td style="padding: 8px; font-size: 13px; font-family: monospace;">${data.phone ?? "N/A"}</td>
        </tr>
        <tr style="background-color: #f2f2f2;">
          <td style="padding: 8px; font-weight: bold; font-size: 13px;">WhatsApp:</td>
          <td style="padding: 8px; font-size: 13px; font-family: monospace;">${data.whatsapp ?? "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; font-size: 13px;">Email:</td>
          <td style="padding: 8px; font-size: 13px;">${data.email ?? "N/A"}</td>
        </tr>
        <tr style="background-color: #f2f2f2;">
          <td style="padding: 8px; font-weight: bold; font-size: 13px;">Budget:</td>
          <td style="padding: 8px; font-size: 13px;">${data.budget_band ?? "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; font-size: 13px;">Location Pref:</td>
          <td style="padding: 8px; font-size: 13px; text-transform: capitalize;">${data.location ?? "N/A"}</td>
        </tr>
        <tr style="background-color: #f2f2f2;">
          <td style="padding: 8px; font-weight: bold; font-size: 13px;">Purpose:</td>
          <td style="padding: 8px; font-size: 13px; text-transform: capitalize;">${data.purpose ?? "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; font-size: 13px;">Timeline:</td>
          <td style="padding: 8px; font-size: 13px; text-transform: capitalize;">${data.timeline ?? "N/A"}</td>
        </tr>
        <tr style="background-color: #f2f2f2;">
          <td style="padding: 8px; font-weight: bold; font-size: 13px;">Message:</td>
          <td style="padding: 8px; font-size: 13px; white-space: pre-wrap;">${data.message ?? "N/A"}</td>
        </tr>
      </table>
      
      <div style="margin-top: 25px; padding: 15px; background-color: #1a1a1a; color: #fff; border-radius: 4px; font-size: 11px;">
        <strong>Full Lead JSON Payload:</strong>
        <pre style="margin-top: 10px; font-family: monospace; white-space: pre-wrap; overflow-x: auto; color: #a5e1ad; background: #000; padding: 10px; border-radius: 3px;">${JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  `;

  // 1. Try Brevo first if configured
  if (serverEnv.BREVO_API_KEY) {
    try {
      console.log(`[leads] Dispatching email via Brevo SMTP API to: ${serverEnv.TEAM_NOTIFICATION_EMAIL}`);
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
          to: [
            {
              email: serverEnv.TEAM_NOTIFICATION_EMAIL,
              name: "PIKORUA Realty Team",
            },
          ],
          subject: subject,
          htmlContent: htmlContent,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Brevo SMTP API status ${res.status}: ${errText}`);
      }
      console.log("[leads] Email notification sent successfully via Brevo.");
      return;
    } catch (err) {
      console.error("[leads] Brevo email notification failed:", err);
      // Fall through to Resend if also present
    }
  }

  // 2. Fallback to Resend if configured
  if (serverEnv.RESEND_API_KEY) {
    try {
      console.log(`[leads] Dispatching email via Resend to: ${serverEnv.TEAM_NOTIFICATION_EMAIL}`);
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serverEnv.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: serverEnv.RESEND_FROM_EMAIL,
          to: [serverEnv.TEAM_NOTIFICATION_EMAIL],
          subject: subject,
          html: htmlContent,
        }),
      });

      if (!res.ok) {
        throw new Error(`Resend ${res.status}`);
      }
      console.log("[leads] Email notification sent successfully via Resend.");
    } catch (err) {
      console.error("[leads] Resend email notification failed:", err);
    }
  }
}

async function pushToCrm(
  serverEnv: ReturnType<typeof getServerEnv>,
  leadId: string,
  data: Record<string, unknown>
) {
  // Zoho CRM push — implement when CRM credentials are ready
  if (!serverEnv.ZOHO_CRM_REFRESH_TOKEN && !serverEnv.HUBSPOT_API_KEY) return;

  // TODO: implement Zoho/HubSpot push using leadId + data
  void leadId;
  void data;
  console.log("[leads] CRM push: credentials present but integration not yet wired.");
}
