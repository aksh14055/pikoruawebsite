import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";

// Singleton documents (only one instance should ever exist)
const SINGLETONS = new Set([
  "homePage",
  "aboutPage",
  "contactPage",
  "siteSettings",
]);

export default defineConfig({
  name: "pikorua-studio",
  title: "PIKORUA Realty",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // ── Singletons ────────────────────────────────────────────────
            S.listItem()
              .title("Home Page")
              .id("homePage")
              .child(S.document().schemaType("homePage").documentId("homePage")),
            S.listItem()
              .title("About Page")
              .id("aboutPage")
              .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
            S.listItem()
              .title("Contact Page")
              .id("contactPage")
              .child(S.document().schemaType("contactPage").documentId("contactPage")),
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.divider(),
            // ── Collections ───────────────────────────────────────────────
            S.documentTypeListItem("property").title("Properties"),
            S.documentTypeListItem("location").title("Locations / Corridors"),
            S.documentTypeListItem("category").title("Residential Categories"),
            S.documentTypeListItem("testimonial").title("Testimonials"),
            S.documentTypeListItem("post").title("Blog Posts"),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    // Prevent new singleton documents from being created via the "New Document" button
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },
  document: {
    // Hide the "Delete" action on singletons
    actions: (prev, { schemaType }) =>
      SINGLETONS.has(schemaType)
        ? prev.filter(({ action }) => action !== "delete")
        : prev,
  },
});
