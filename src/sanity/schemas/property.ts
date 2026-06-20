import { defineField, defineType } from "sanity";

// Category and status values are restricted to residential-only at the schema level.
// Adding a commercial value here would require a deploy — this is intentional.

export const propertySchema = defineType({
  name: "property",
  title: "Property",
  type: "document",
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "media", title: "Media" },
    { name: "content", title: "Content" },
    { name: "publishing", title: "Publishing & SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Property Title",
      type: "string",
      group: "details",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      group: "details",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      group: "details",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "location",
      title: "Location / Corridor",
      type: "reference",
      to: [{ type: "location" }],
      group: "details",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "configuration",
      title: "Configuration",
      type: "string",
      description: "e.g. 4BHK, 5BHK / Penthouse, Duplex",
      group: "details",
      validation: (r) => r.required().max(100),
    }),
    defineField({
      name: "builtUpArea",
      title: "Built-up Area (sq.ft)",
      type: "number",
      group: "details",
    }),
    defineField({
      name: "plotArea",
      title: "Plot Area (sq.ft)",
      type: "number",
      group: "details",
    }),
    defineField({
      name: "floor",
      title: "Floor",
      type: "string",
      description: "e.g. 22nd Floor, Ground + 2",
      group: "details",
    }),
    defineField({
      name: "priceOnRequest",
      title: "Price on Request",
      type: "boolean",
      initialValue: false,
      group: "details",
    }),
    defineField({
      name: "price",
      title: "Price (in Crores ₹)",
      type: "number",
      description: "Leave blank if 'Price on Request' is enabled",
      group: "details",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Newly Launched", value: "newly-launched" },
          { title: "Sample Ready", value: "sample-ready" },
          { title: "Pre-Launch", value: "pre-launch" },
          { title: "Under Construction", value: "under-construction" },
          { title: "Near Possession", value: "near-possession" },
          { title: "Ready to Move", value: "ready-to-move" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "shortDescriptor",
      title: "Short Descriptor",
      type: "string",
      description: "One line shown on the property card",
      group: "content",
      validation: (r) => r.required().max(140),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      description: "2–3 advisory-tone paragraphs. No hype.",
      group: "content",
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
      description: "Short bullet points: amenities, views, floor, possession",
      group: "content",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() }),
      ],
      group: "media",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() }),
          ],
        },
      ],
      group: "media",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: false,
      group: "publishing",
    }),
    defineField({
      name: "isPublished",
      title: "Published",
      type: "boolean",
      initialValue: false,
      description: "Only published properties appear on the site",
      group: "publishing",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
      group: "publishing",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "publishing",
      fields: [
        defineField({ name: "title", title: "Meta Title", type: "string", validation: (r) => r.max(70) }),
        defineField({ name: "description", title: "Meta Description", type: "string", validation: (r) => r.max(160) }),
        defineField({
          name: "ogImage",
          title: "OG Image",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "location.name",
      media: "heroImage",
      isPublished: "isPublished",
    },
    prepare({ title, subtitle, media, isPublished }) {
      return {
        title: `${isPublished ? "" : "⚪ "}${title}`,
        subtitle,
        media,
      };
    },
  },
});
