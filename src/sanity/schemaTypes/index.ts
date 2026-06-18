import { propertySchema } from "../schemas/property";
import { locationSchema } from "../schemas/location";
import { categorySchema } from "../schemas/category";
import { testimonialSchema } from "../schemas/testimonial";
import { siteSettingsSchema } from "../schemas/siteSettings";
import { homePageSchema, aboutPageSchema, contactPageSchema } from "../schemas/pageSingletons";
import { postSchema } from "../schemas/post";

export const schemaTypes = [
  // Collections
  propertySchema,
  locationSchema,
  categorySchema,
  testimonialSchema,
  postSchema,
  // Singletons
  homePageSchema,
  aboutPageSchema,
  contactPageSchema,
  siteSettingsSchema,
];
