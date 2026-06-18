import { defineField, defineType } from "sanity";

export const postSchema = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "content", title: "Content" },
    { name: "publishing", title: "Publishing & SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "details",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "details",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Market Report", value: "market-report" },
          { title: "Private Advisory", value: "advisory" },
          { title: "NRI Insights", value: "nri-insights" },
          { title: "Corridor Spotlight", value: "corridor-spotlight" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "details",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "readTime",
      title: "Read Time (e.g. '5 min read')",
      type: "string",
      group: "details",
      validation: (r) => r.required().max(30),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "A short summary shown on the blog list page.",
      group: "content",
      validation: (r) => r.required().max(250),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() }),
      ],
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "body",
      title: "Body Content",
      type: "array",
      of: [{ type: "block" }],
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Post",
      type: "boolean",
      initialValue: false,
      group: "publishing",
    }),
    defineField({
      name: "isPublished",
      title: "Published",
      type: "boolean",
      initialValue: false,
      group: "publishing",
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
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
    select: { title: "title", subtitle: "category", media: "coverImage", isPublished: "isPublished" },
    prepare({ title, subtitle, media, isPublished }) {
      return {
        title: `${isPublished ? "" : "⚪ "}${title}`,
        subtitle: subtitle ? `Category: ${subtitle}` : "",
        media,
      };
    },
  },
});
