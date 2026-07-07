import { defineField, defineType } from "sanity";

// Core categories are residential. "office" and "showroom" exist as a
// selective commercial-advisory add-on (see ResidentialCategory in
// src/types/index.ts) — do not add further commercial types beyond those two
// (e.g. retail, warehouse) without an explicit product decision.

export const categorySchema = defineType({
  name: "category",
  title: "Residential Category",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Category Name",
      type: "string",
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 48,
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (r) => r.max(300),
    }),
    defineField({
      name: "icon",
      title: "Icon / Illustration",
      type: "image",
      options: { hotspot: false },
    }),
  ],
  preview: {
    select: { title: "name", media: "icon" },
  },
});
