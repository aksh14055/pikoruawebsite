import type { Metadata } from "next";
import { ContentClusterIndex } from "@/components/seo/ContentClusterIndex";
import { getContentHubsByPrefix } from "@/lib/data/content-hubs";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Ahmedabad Luxury Property Buyer Guides",
  description: "Practical due-diligence and home-selection guides for Ahmedabad luxury property buyers, NRIs and business families.",
  path: "/learn",
});

export default function LearnIndexPage() {
  return (
    <ContentClusterIndex
      title="Luxury Property Buyer Guides"
      eyebrow="Evidence Before Marketing"
      description="Practical frameworks for inspecting, comparing and rejecting luxury property options before money or documents are committed."
      pages={getContentHubsByPrefix("learn")}
    />
  );
}
