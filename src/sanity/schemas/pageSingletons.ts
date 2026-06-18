import { defineField, defineType } from "sanity";

// ─── Shared block content field ────────────────────────────────────────────
const richTextField = (name: string, title: string) =>
  defineField({ name, title, type: "array", of: [{ type: "block" }] });

// ─── Home Page Singleton ───────────────────────────────────────────────────

export const homePageSchema = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "sections", title: "Sections" },
    { name: "nri", title: "NRI Advisory" },
    { name: "seller", title: "Seller Representation" },
    { name: "founder", title: "Founder Teaser" },
    { name: "cta", title: "Final CTA" },
  ],
  fields: [
    defineField({ name: "heroHeadline", title: "Hero Headline", type: "string", group: "hero", validation: (r) => r.required().max(80) }),
    defineField({ name: "heroSubhead", title: "Hero Subhead", type: "string", group: "hero", validation: (r) => r.max(140) }),
    defineField({ name: "heroVideo", title: "Hero Video (≤3MB)", type: "file", options: { accept: "video/*" }, group: "hero" }),
    defineField({
      name: "heroPoster",
      title: "Hero Poster Image (shown before video / on mobile)",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text", validation: (r) => r.required() })],
      group: "hero",
      validation: (r) => r.required(),
    }),
    defineField({ name: "positioningStatement", title: "Positioning Statement", type: "string", group: "sections", validation: (r) => r.max(200) }),
    richTextField("guidedDiscoveryInvite", "Guided Discovery Invite Text"),
    richTextField("nriCopy", "NRI Advisory Copy"),
    defineField({ name: "nriCtaLabel", title: "NRI CTA Label", type: "string", initialValue: "Talk to Us from Anywhere", group: "nri" }),
    richTextField("sellerCopy", "Seller Representation Copy"),
    defineField({ name: "sellerCtaLabel", title: "Seller CTA Label", type: "string", initialValue: "Discuss Selling, Privately", group: "seller" }),
    defineField({
      name: "founderPortrait",
      title: "Founder Portrait",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text", validation: (r) => r.required() })],
      group: "founder",
    }),
    richTextField("founderTeaserCopy", "Founder Teaser Copy (2–3 lines)"),
    defineField({ name: "finalCtaHeadline", title: "Final CTA Headline", type: "string", initialValue: "Begin a private conversation.", group: "cta" }),
  ],
  preview: { prepare() { return { title: "Home Page" }; } },
});

// ─── About Page Singleton ──────────────────────────────────────────────────

export const aboutPageSchema = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({ name: "founderName", title: "Founder Name", type: "string", initialValue: "Jitendra", validation: (r) => r.required() }),
    defineField({
      name: "founderPortrait",
      title: "Founder Portrait",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text", validation: (r) => r.required() })],
    }),
    richTextField("founderStory", "Founder Story"),
    richTextField("pikoruaMeaning", "Pikorua Meaning & Philosophy"),
    richTextField("advisoryApproach", "Advisory Approach & Discretion"),
    richTextField("sellerRepresentation", "Seller Representation"),
    richTextField("developerTrust", "Developer Trust & Partnerships"),
    richTextField("reach", "Reach (Ahmedabad primary, selective Mumbai & Dubai)"),
  ],
  preview: { prepare() { return { title: "About Page" }; } },
});

// ─── Contact Page Singleton ────────────────────────────────────────────────

export const contactPageSchema = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({ name: "leadInLine", title: "Lead-in Line", type: "string", initialValue: "Begin a private conversation.", validation: (r) => r.max(120) }),
    richTextField("nriAdvisoryCopy", "NRI Advisory Section Copy"),
    defineField({ name: "privacyReassurance", title: "Privacy Reassurance Microcopy", type: "string", initialValue: "Your enquiry is private. We respond personally, never with spam.", validation: (r) => r.max(200) }),
  ],
  preview: { prepare() { return { title: "Contact Page" }; } },
});
