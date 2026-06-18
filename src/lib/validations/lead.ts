import { z } from "zod";

// ─── Shared field primitives ───────────────────────────────────────────────

const phoneSchema = z
  .string()
  .min(7, "Please enter a valid phone number")
  .max(20, "Phone number is too long")
  .regex(/^\+?[\d\s\-().]{7,20}$/, "Please enter a valid phone number");

const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .max(254);

// Zod v4: errorMap removed — use message directly
const consentSchema = z.literal(true, {
  message: "Please consent to be contacted",
});

const honeypotSchema = z.string().max(0, "Bot detected").optional();

// Zod v4: z.record() requires both key and value types
const utmSchema = z.record(z.string(), z.string()).optional();

// ─── A. Guided Discovery (6-step) ─────────────────────────────────────────

export const discoverySchema = z.object({
  honeypot: honeypotSchema,
  category: z.enum([
    "apartment",
    "penthouse",
    "villa",
    "bungalow",
    "plot",
    "residential-investment",
  ]),
  locations: z
    .array(
      z.enum([
        "iskon-ambli",
        "sindhu-bhavan",
        "thaltej",
        "shilaj",
        "vaishno-devi",
        "sg-highway",
        "other",
      ])
    )
    .min(1, "Please select at least one location"),
  budgetBand: z.enum(["1-2cr", "2-3cr", "3-5cr", "5-10cr", "10cr-plus", "custom"]),
  purpose: z.enum([
    "self-use",
    "investment",
    "nri-purchase",
    "selling",
    "exploring",
  ]),
  timeline: z.enum([
    "immediately",
    "1-3months",
    "3-6months",
    "exploring",
  ]),
  name: z.string().min(2, "Please enter your name").max(100),
  phone: phoneSchema,
  whatsapp: z
    .string()
    .max(20)
    .regex(/^\+?[\d\s\-().]{7,20}$/, "Please enter a valid WhatsApp number")
    .optional()
    .or(z.literal("")),
  email: emailSchema.optional().or(z.literal("")),
  preferredCallbackTime: z.string().max(100).optional(),
  consent: consentSchema,
  utm: utmSchema,
});

export type DiscoveryInput = z.infer<typeof discoverySchema>;

// ─── B. Property Enquiry ──────────────────────────────────────────────────

export const propertyEnquirySchema = z.object({
  honeypot: honeypotSchema,
  name: z.string().min(2, "Please enter your name").max(100),
  phone: phoneSchema,
  whatsapp: z.string().max(20).optional().or(z.literal("")),
  email: emailSchema,
  propertyRef: z.string().max(200),
  message: z.string().max(1000).optional(),
  preferredCallbackTime: z.string().max(100).optional(),
  consent: consentSchema,
  utm: utmSchema,
});

export type PropertyEnquiryInput = z.infer<typeof propertyEnquirySchema>;

// ─── C. Callback Request ──────────────────────────────────────────────────

export const callbackSchema = z.object({
  honeypot: honeypotSchema,
  name: z.string().min(2, "Please enter your name").max(100),
  phone: phoneSchema,
  preferredCallbackTime: z
    .string()
    .min(1, "Please select a preferred time")
    .max(100),
  consent: consentSchema,
  utm: utmSchema,
});

export type CallbackInput = z.infer<typeof callbackSchema>;

// ─── D. Private Consultation Booking ──────────────────────────────────────

export const consultationSchema = z.object({
  honeypot: honeypotSchema,
  name: z.string().min(2, "Please enter your name").max(100),
  phone: phoneSchema,
  email: emailSchema,
  preferredDate: z.string().max(50).optional(),
  preferredTimeSlot: z.string().max(50).optional(),
  purpose: z.enum(["buy", "sell", "invest", "nri", "explore"]).optional(),
  notes: z.string().max(1000).optional(),
  consent: consentSchema,
  utm: utmSchema,
});

export type ConsultationInput = z.infer<typeof consultationSchema>;

// ─── E. Contact / Qualified Enquiry ───────────────────────────────────────

export const contactSchema = z.object({
  honeypot: honeypotSchema,
  name: z.string().min(2, "Please enter your name").max(100),
  phone: phoneSchema,
  whatsapp: z.string().max(20).optional().or(z.literal("")),
  email: emailSchema,
  interest: z.string().max(200).optional(),
  message: z.string().max(1000).optional(),
  preferredCallbackTime: z.string().max(100).optional(),
  consent: consentSchema,
  utm: utmSchema,
});

export type ContactInput = z.infer<typeof contactSchema>;
