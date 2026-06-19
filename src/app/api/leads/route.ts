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

  // Format labels nicely
  const BUDGET_LABELS: Record<string, string> = {
    "1-2cr": "₹1 Cr – ₹2 Cr",
    "2-3cr": "₹2 Cr – ₹3 Cr",
    "3-5cr": "₹3 Cr – ₹5 Cr",
    "5-10cr": "₹5 Cr – ₹10 Cr",
    "10cr-plus": "₹10 Cr and above",
    "custom": "Custom / Not decided",
  };

  const CATEGORY_LABELS: Record<string, string> = {
    "apartment": "Apartment",
    "penthouse": "Penthouse",
    "villa": "Villa",
    "bungalow": "Bungalow",
    "plot": "Premium Plot",
    "residential-investment": "Residential Investment",
  };

  const LOCATION_LABELS: Record<string, string> = {
    "iskon-ambli": "Iskon–Ambli",
    "sindhu-bhavan": "Sindhu Bhavan",
    "thaltej": "Thaltej",
    "shilaj": "Shilaj",
    "vaishno-devi": "Vaishno Devi",
    "sg-highway": "SG Highway",
    "other": "Open to suggestions",
  };

  const rawBudget = (data.budgetBand || data.budget_band) as string | undefined;
  const formattedBudget = rawBudget ? (BUDGET_LABELS[rawBudget] || rawBudget) : undefined;

  const rawCategory = data.category as string | undefined;
  const formattedCategory = rawCategory ? (CATEGORY_LABELS[rawCategory] || rawCategory) : undefined;

  let formattedLocation: string | undefined = undefined;
  const rawLocation = data.locations || data.location;
  if (rawLocation) {
    if (Array.isArray(rawLocation)) {
      formattedLocation = rawLocation.map((loc) => LOCATION_LABELS[loc] || loc).join(", ");
    } else {
      formattedLocation = LOCATION_LABELS[rawLocation as string] || (rawLocation as string);
    }
  }

  const preferredCallbackTime = (data.preferredCallbackTime || data.preferred_callback_time) as string | undefined;
  const propertyRef = (data.propertyRef || data.property_ref) as string | undefined;
  const preferredDate = (data.preferredDate || data.preferred_date) as string | undefined;
  const preferredTimeSlot = (data.preferredTimeSlot || data.preferred_time_slot) as string | undefined;
  const notes = (data.notes || data.notes) as string | undefined;

  // Build rows dynamically to only display populated details
  const rows: { label: string; value: string; capitalize?: boolean }[] = [
    { label: "Lead ID", value: leadId },
    { label: "Source", value: source, capitalize: true },
    { label: "Name", value: (data.name as string) || "Unknown" },
    { label: "Phone", value: (data.phone as string) || "N/A" },
  ];

  if (data.whatsapp) {
    rows.push({ label: "WhatsApp", value: data.whatsapp as string });
  }
  if (data.email) {
    rows.push({ label: "Email", value: data.email as string });
  }
  if (formattedCategory) {
    rows.push({ label: "Category", value: formattedCategory });
  }
  if (formattedBudget) {
    rows.push({ label: "Budget", value: formattedBudget });
  }
  if (formattedLocation) {
    rows.push({ label: "Location Pref", value: formattedLocation, capitalize: true });
  }
  if (data.purpose) {
    rows.push({ label: "Purpose", value: data.purpose as string, capitalize: true });
  }
  if (data.timeline) {
    rows.push({ label: "Timeline", value: data.timeline as string, capitalize: true });
  }
  if (preferredCallbackTime) {
    rows.push({ label: "Preferred Callback Time", value: preferredCallbackTime });
  }
  if (propertyRef) {
    rows.push({ label: "Property Reference", value: propertyRef });
  }
  if (preferredDate) {
    rows.push({ label: "Preferred Date", value: preferredDate });
  }
  if (preferredTimeSlot) {
    rows.push({ label: "Preferred Time Slot", value: preferredTimeSlot });
  }
  if (data.message) {
    rows.push({ label: "Message", value: data.message as string });
  } else if (notes) {
    rows.push({ label: "Message / Notes", value: notes });
  }

  const tableRowsHtml = rows
    .map((row, index) => {
      const isEven = index % 2 === 0;
      const bg = isEven ? "background-color: #f9f9f9;" : "background-color: #ffffff;";
      const textStyle = row.capitalize ? "text-transform: capitalize;" : "";
      return `
        <tr style="${bg}">
          <td style="padding: 10px 12px; font-weight: bold; width: 180px; font-size: 13px; border-bottom: 1px solid #eeeeee; color: #555555; font-family: sans-serif;">${row.label}:</td>
          <td style="padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #eeeeee; color: #111111; font-family: sans-serif; ${textStyle}">${row.value}</td>
        </tr>
      `;
    })
    .join("");

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #fafafa;">
      <h2 style="color: #c5a880; border-bottom: 2px solid #c5a880; padding-bottom: 10px; margin-top: 0; font-family: sans-serif;">New Lead Submission — PIKORUA Realty</h2>
      <p style="font-size: 14px; color: #333333; font-family: sans-serif;">A new lead has been submitted on the website.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px; border: 1px solid #eeeeee;">
        ${tableRowsHtml}
      </table>
      
      <div style="margin-top: 25px; padding: 15px; background-color: #1a1a1a; color: #ffffff; border-radius: 4px; font-size: 11px; font-family: sans-serif;">
        <strong>Full Lead JSON Payload:</strong>
        <pre style="margin-top: 10px; font-family: monospace; white-space: pre-wrap; overflow-x: auto; color: #a5e1ad; background: #000000; padding: 10px; border-radius: 3px;">${JSON.stringify(data, null, 2)}</pre>
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
