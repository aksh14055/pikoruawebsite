import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "contact", title: "Contact" },
    { name: "analytics", title: "Analytics" },
    { name: "whatsapp", title: "WhatsApp" },
    { name: "seo", title: "Default SEO" },
  ],
  fields: [
    defineField({ name: "email", title: "Contact Email", type: "string", group: "contact", validation: (r) => r.required() }),
    defineField({ name: "phone", title: "Phone (with country code)", type: "string", group: "contact", validation: (r) => r.required() }),
    defineField({ name: "whatsappNumber", title: "WhatsApp Number (with country code, no spaces)", type: "string", group: "whatsapp", validation: (r) => r.required() }),
    defineField({ name: "whatsappDefaultMessage", title: "WhatsApp Default Prefilled Message", type: "text", rows: 2, group: "whatsapp" }),
    defineField({ name: "address", title: "Office Address", type: "text", rows: 3, group: "contact" }),
    defineField({ name: "googleMapsUrl", title: "Google Maps Profile URL", type: "url", group: "contact" }),
    defineField({ name: "officeHours", title: "Office Hours", type: "string", group: "contact" }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
        defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
        defineField({ name: "youtube", title: "YouTube URL", type: "url" }),
      ],
    }),
    defineField({ name: "ga4MeasurementId", title: "GA4 Measurement ID", type: "string", description: "e.g. G-XXXXXXXXXX", group: "analytics" }),
    defineField({ name: "gtmContainerId", title: "GTM Container ID", type: "string", description: "e.g. GTM-XXXXXXX", group: "analytics" }),
    defineField({ name: "metaPixelId", title: "Meta Pixel ID", type: "string", group: "analytics" }),
    defineField({ name: "responseTimeCopy", title: "Response Time Copy", type: "string", description: "e.g. 'We respond within a few hours.' — only use if operationally true", group: "contact" }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "object",
      group: "seo",
      fields: [
        defineField({ name: "title", type: "string", title: "Default Title", validation: (r) => r.max(70) }),
        defineField({ name: "description", type: "string", title: "Default Description", validation: (r) => r.max(160) }),
        defineField({ name: "ogImage", type: "image", title: "Default OG Image", options: { hotspot: true } }),
      ],
    }),
  ],
  preview: {
    prepare() { return { title: "Site Settings" }; },
  },
});
