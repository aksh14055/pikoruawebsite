import { defineField, defineType } from "sanity";

export const testimonialSchema = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "clientName",
      title: "Client Name / Initial",
      type: "string",
      description: "First name or initial only for privacy (e.g. 'Priya S.')",
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      description: "The real client quote — never fabricated",
      validation: (r) => r.required().max(600),
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "string",
      description: "e.g. 'NRI buyer · Sindhu Bhavan' or 'Investor · Iskon-Ambli'",
      validation: (r) => r.max(100),
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: {
        list: [
          { title: "Google Review", value: "google" },
          { title: "Direct", value: "direct" },
        ],
        layout: "radio",
      },
      initialValue: "google",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating (out of 5)",
      type: "number",
      description: "Only enter if verifiably accurate from Google",
      validation: (r) => r.min(1).max(5),
    }),
    defineField({
      name: "isFeatured",
      title: "Featured (show on Homepage & Properties teaser)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isPublished",
      title: "Published",
      type: "boolean",
      initialValue: false,
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "clientName", subtitle: "context", isPublished: "isPublished" },
    prepare({ title, subtitle, isPublished }) {
      return { title: `${isPublished ? "" : "⚪ "}${title}`, subtitle };
    },
  },
});
