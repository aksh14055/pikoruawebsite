import { createClient, type SanityClient } from "next-sanity";

// Lazy singleton — avoids throwing during `next build` when env vars are absent.
let _client: SanityClient | null = null;

export function getSanityClient(): SanityClient {
  if (!_client) {
    _client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
      apiVersion: "2024-01-01",
      useCdn: process.env.NODE_ENV === "production",
    });
  }
  return _client;
}

// Draft-mode client (server-side only — never expose token to the client)
export function getSanityDraftClient(token: string): SanityClient {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: "2024-01-01",
    useCdn: false,
    token,
    perspective: "previewDrafts",
  });
}
