import { NextRequest, NextResponse } from "next/server";
import { ZodError, type ZodTypeAny } from "zod";
import {
  discoverySchema,
  propertyEnquirySchema,
  callbackSchema,
  consultationSchema,
  contactSchema,
} from "@/lib/validations/lead";
import { getLeadDeliveryEnv } from "@/lib/env";
import { getClientIdentifier, leadRateLimit } from "@/lib/rate-limit";
import type { LeadSource } from "@/types";

const SCHEMAS: Record<string, ZodTypeAny> = {
  discovery: discoverySchema,
  enquiry: propertyEnquirySchema,
  callback: callbackSchema,
  consultation: consultationSchema,
  contact: contactSchema,
  popup: contactSchema,
};

const SOURCE_LABELS: Record<string, string> = {
  discovery: "CONTENT FORM",
  enquiry: "PROPERTY ENQUIRY FORM",
  callback: "CALLBACK REQUEST",
  consultation: "CONSULTATION BOOKING",
  contact: "CONTACT FORM",
  popup: "POPUP LEAD FORM",
  whatsapp: "WHATSAPP",
};

const BUDGET_LABELS: Record<string, string> = {
  "1-2cr": "INR 1 Cr - INR 2 Cr",
  "3-4cr": "INR 3 Cr - INR 4 Cr",
  "5-7cr": "INR 5 Cr - INR 7 Cr",
  "8-10cr": "INR 8 Cr - INR 10 Cr",
  "10cr-plus": "INR 10 Cr and above",
};

const LOCATION_LABELS: Record<string, string> = {
  "iskon-ambli": "Iskon-Ambli",
  "sindhu-bhavan": "Sindhu Bhavan",
  thaltej: "Thaltej",
  shilaj: "Shilaj",
  "vaishno-devi": "Vaishno Devi",
  "sg-highway": "SG Highway",
  other: "Open to suggestions",
};

const CATEGORY_LABELS: Record<string, string> = {
  apartment: "Apartment",
  penthouse: "Penthouse",
  villa: "Villa",
  bungalow: "Bungalow",
  plot: "Premium Plot",
  "residential-investment": "Residential Investment",
  office: "Office",
  showroom: "Showroom",
};

export async function POST(req: NextRequest) {
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const source = (raw.source ?? "contact") as LeadSource;

  if (raw.honeypot && String(raw.honeypot).length > 0) {
    return NextResponse.json({ ok: true });
  }

  const schema = SCHEMAS[source];
  if (!schema) {
    return NextResponse.json({ error: "Unknown submission source" }, { status: 400 });
  }

  let data: Record<string, unknown>;
  try {
    data = schema.parse(raw) as Record<string, unknown>;
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", fields: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    throw err;
  }

  const leadId = crypto.randomUUID();

  try {
    await deliverLead(leadId, source, data);
  } catch (err) {
    console.error("[leads/route] Brevo lead delivery failed:", err);
  }

  return NextResponse.json({ ok: true, leadId });
}

async function deliverLead(leadId: string, source: string, data: Record<string, unknown>) {
  const serverEnv = getLeadDeliveryEnv();

  if (!serverEnv.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not configured");
  }

  await syncBrevoContact(serverEnv, leadId, source, data);
  await sendBrevoLeadEmail(serverEnv, leadId, source, data);
  await pushToCrm(serverEnv, leadId, data);
}

async function syncBrevoContact(
  serverEnv: ReturnType<typeof getLeadDeliveryEnv>,
  leadId: string,
  source: string,
  data: Record<string, unknown>
) {
  const email = typeof data.email === "string" ? data.email.trim() : "";
  if (!email) return;

  const nameParts = String(data.name ?? "").trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts.shift() ?? "";
  const lastName = nameParts.join(" ");
  const phone = normalizePhone(data.phone);
  const listIds = serverEnv.BREVO_LIST_IDS
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isInteger(value) && value > 0);

  const attributes: Record<string, string> = {};
  if (firstName) attributes.FIRSTNAME = firstName;
  if (lastName) attributes.LASTNAME = lastName;
  if (phone) attributes.SMS = phone;

  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": serverEnv.BREVO_API_KEY,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      email,
      attributes,
      ...(listIds.length > 0 ? { listIds } : {}),
      updateEnabled: true,
    }),
  });

  if (!response.ok) {
    console.error("[leads/route] Brevo contact sync failed:", {
      leadId,
      source,
      status: response.status,
      error: await response.text(),
    });
  }
}

async function sendBrevoLeadEmail(
  serverEnv: ReturnType<typeof getLeadDeliveryEnv>,
  leadId: string,
  source: string,
  data: Record<string, unknown>
) {
  const formType = SOURCE_LABELS[source] || source.toUpperCase();
  const subject = `PIKORUA WEB - ${formType} Lead: ${String(data.name ?? "Unknown")}`;
  const rows = buildLeadRows(leadId, formType, data);

  const tableRowsHtml = rows
    .map((row, index) => {
      const bg = index % 2 === 0 ? "#f5f5f5" : "#ffffff";
      return `<tr style="background-color:${bg}"><td style="padding:12px 15px;font-weight:600;width:165px;font-size:13px;border-bottom:1px solid #e8e8e8;color:#333;font-family:Arial,sans-serif;">${escapeHtml(row.label)}:</td><td style="padding:12px 15px;font-size:13px;border-bottom:1px solid #e8e8e8;color:#000;font-family:Arial,sans-serif;">${escapeHtml(row.value)}</td></tr>`;
    })
    .join("");

  const htmlContent = `
    <div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto;padding:20px;">
      <div style="background-color:#0B0B0B;color:#C8A45D;padding:20px;border-radius:5px 5px 0 0;text-align:center;">
        <h1 style="margin:0;font-size:24px;font-weight:700;">PIKORUA REALTY</h1>
        <p style="margin:8px 0 0 0;font-size:12px;letter-spacing:1px;text-transform:uppercase;">New Lead Submission</p>
      </div>
      <div style="background-color:#fff;padding:20px;border-radius:0 0 5px 5px;border:1px solid #e8e8e8;border-top:none;">
        <p style="margin:0 0 15px 0;font-size:14px;color:#555;"><strong>Source:</strong> <span style="color:#C8A45D;font-weight:600;">${escapeHtml(formType)}</span></p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;border:1px solid #e8e8e8;">${tableRowsHtml}</table>
        <div style="background-color:#f9f9f9;padding:15px;border-left:4px solid #C8A45D;margin-top:20px;">
          <p style="margin:0;font-size:12px;color:#666;font-style:italic;">Lead ID: ${escapeHtml(leadId)}</p>
        </div>
      </div>
    </div>
  `;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
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
      to: [{ email: serverEnv.TEAM_NOTIFICATION_EMAIL }],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    throw new Error(`Brevo SMTP API status ${response.status}: ${await response.text()}`);
  }
}

function buildLeadRows(leadId: string, formType: string, data: Record<string, unknown>) {
  const rows: { label: string; value: string }[] = [
    { label: "Lead ID", value: leadId },
    { label: "Source", value: formType },
    { label: "Name", value: String(data.name ?? "Unknown") },
    { label: "Phone", value: String(data.phone ?? "N/A") },
  ];

  addRow(rows, "WhatsApp", data.whatsapp);
  addRow(rows, "Email", data.email);
  addRow(rows, "Property Type", labelValue(data.category, CATEGORY_LABELS));
  addRow(rows, "Budget", labelValue(data.budgetBand ?? data.budget_band, BUDGET_LABELS));
  addRow(rows, "Location Preference", formatLocation(data.locations ?? data.location));
  addRow(rows, "Purpose", humanize(data.purpose));
  addRow(rows, "Timeline", humanize(data.timeline));
  addRow(rows, "Preferred Callback Time", data.preferredCallbackTime ?? data.preferred_callback_time);
  addRow(rows, "Property Reference", data.propertyRef ?? data.property_ref);
  addRow(rows, "Preferred Date", data.preferredDate ?? data.preferred_date);
  addRow(rows, "Preferred Time Slot", data.preferredTimeSlot ?? data.preferred_time_slot);
  addRow(rows, "Interest", data.interest);
  addRow(rows, "Message", data.message);
  addRow(rows, "Notes", data.notes);

  const utm = data.utm;
  if (utm && typeof utm === "object") {
    addRow(rows, "UTM", JSON.stringify(utm));
  }

  return rows;
}

function addRow(rows: { label: string; value: string }[], label: string, value: unknown) {
  if (value === undefined || value === null || value === "") return;
  rows.push({ label, value: String(value) });
}

function labelValue(value: unknown, labels: Record<string, string>) {
  if (typeof value !== "string" || !value) return undefined;
  return labels[value] || value;
}

function formatLocation(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => labelValue(item, LOCATION_LABELS) || String(item)).join(", ");
  }
  return labelValue(value, LOCATION_LABELS);
}

function humanize(value: unknown) {
  if (typeof value !== "string" || !value) return undefined;
  return value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizePhone(value: unknown) {
  const rawPhone = String(value ?? "").replace(/[^\d+]/g, "");
  return /^\d{10}$/.test(rawPhone) ? `+91${rawPhone}` : rawPhone;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

async function pushToCrm(
  serverEnv: ReturnType<typeof getLeadDeliveryEnv>,
  leadId: string,
  data: Record<string, unknown>
) {
  if (!serverEnv.ZOHO_CRM_REFRESH_TOKEN && !serverEnv.HUBSPOT_API_KEY) return;

  void leadId;
  void data;
  console.log("[leads] CRM push: credentials present but integration not yet wired.");
}
