import { getSanityClient } from "./client";
import type { Location, Testimonial } from "@/types";

// ─── Locations ─────────────────────────────────────────────────────────────

export async function getActiveLocations(): Promise<Location[]> {
  return getSanityClient().fetch<Location[]>(
    `*[_type == "location" && isActive == true] | order(name asc) {
      _id, name, "slug": slug.current, corridorDescription, heroImage, coordinates, isActive
    }`,
    {},
    { next: { tags: ["locations"] } }
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────────

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  return getSanityClient().fetch<Testimonial[]>(
    `*[_type == "testimonial" && isPublished == true && isFeatured == true] | order(_createdAt desc)[0...3] {
      _id, clientName, quote, context, source, rating, isFeatured, isPublished
    }`,
    {},
    { next: { tags: ["testimonials"] } }
  );
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return getSanityClient().fetch<Testimonial[]>(
    `*[_type == "testimonial" && isPublished == true] | order(_createdAt desc) {
      _id, clientName, quote, context, source, rating, isFeatured, isPublished
    }`,
    {},
    { next: { tags: ["testimonials"] } }
  );
}
