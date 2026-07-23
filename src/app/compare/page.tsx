import type { Metadata } from "next";
import { ContentClusterIndex } from "@/components/seo/ContentClusterIndex";
import { getContentHubsByPrefix } from "@/lib/data/content-hubs";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Ahmedabad Property Comparison Guides",
  description: "Decision-oriented comparisons of Ahmedabad locations, property formats, possession stages and investment alternatives.",
  path: "/compare",
});

export default function CompareIndexPage() {
  return (
    <ContentClusterIndex
      title="Property Comparison Guides"
      eyebrow="Compare Before You Commit"
      description="Side-by-side analysis for buyers deciding between locations, formats and transaction stages—not generic rankings."
      pages={getContentHubsByPrefix("compare")}
    />
  );
}
