import { defineField, defineType } from "sanity";

export const locationSchema = defineType({
  name: "location",
  title: "Location / Corridor",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Location Name",
      type: "string",
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "corridorDescription",
      title: "Corridor Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Character, lifestyle, connectivity — used for SEO depth",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: "coordinates",
      title: "Coordinates",
      type: "object",
      fields: [
        defineField({ name: "lat", title: "Latitude", type: "number" }),
        defineField({ name: "lng", title: "Longitude", type: "number" }),
      ],
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Only active locations appear in the corridor selector",
    }),
  ],
  preview: {
    select: { title: "name", media: "heroImage", isActive: "isActive" },
    prepare({ title, media, isActive }) {
      return { title: `${isActive ? "" : "⚪ "}${title}`, media };
    },
  },
});
