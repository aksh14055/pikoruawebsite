/**
 * combo-seeder.ts
 *
 * Priority-scored top-500 static combo params.
 *
 * These combos are pre-rendered as SSG at build time (generateStaticParams).
 * All other valid combos are served via ISR (dynamicParams = true).
 *
 * Scoring formula:
 *   score = location.weight × type.weight × bhk.weight × budget.weight × intent.weight
 *
 * We generate all 2–5 segment combinations (location only through full 5-tuple)
 * and take the top 500 by score. 1-segment combos (location only) are all included
 * since there are only 50.
 */

import {
  SEO_LOCATIONS,
  SEO_PROPERTY_TYPES,
  SEO_BHK_OPTIONS,
  SEO_BUDGET_RANGES,
  SEO_INTENTS,
  type ParsedCombo,
} from "@/lib/data/seo-dimensions";

interface ScoredCombo {
  segments: string[];
  score: number;
}

function allCombos(): ScoredCombo[] {
  const results: ScoredCombo[] = [];

  for (const loc of SEO_LOCATIONS) {
    // Tier 1: location only (/p/[location])
    results.push({ segments: [loc.slug], score: loc.weight * 100 });

    for (const type of SEO_PROPERTY_TYPES) {
      // Tier 2: location + type (/p/[location]/[type])
      const t2score = loc.weight * type.weight * 10;
      results.push({ segments: [loc.slug, type.slug], score: t2score });

      // BHK combos only for applicable types
      if (type.bhkApplicable) {
        for (const bhk of SEO_BHK_OPTIONS) {
          // Tier 3: + BHK
          const t3score = loc.weight * type.weight * bhk.weight;
          results.push({ segments: [loc.slug, type.slug, bhk.slug], score: t3score });

          for (const budget of SEO_BUDGET_RANGES) {
            // Tier 4: + budget
            const t4score = (loc.weight * type.weight * bhk.weight * budget.weight) / 10;
            results.push({ segments: [loc.slug, type.slug, bhk.slug, budget.slug], score: t4score });

            for (const intent of SEO_INTENTS) {
              // Tier 5: full combo
              const t5score = (loc.weight * type.weight * bhk.weight * budget.weight * intent.weight) / 100;
              results.push({ segments: [loc.slug, type.slug, bhk.slug, budget.slug, intent.slug], score: t5score });
            }
          }
        }
      } else {
        // Non-BHK types (commercial): go straight to budget + intent
        for (const budget of SEO_BUDGET_RANGES) {
          const t4score = (loc.weight * type.weight * budget.weight) / 5;
          results.push({ segments: [loc.slug, type.slug, budget.slug], score: t4score });

          for (const intent of SEO_INTENTS) {
            const t5score = (loc.weight * type.weight * budget.weight * intent.weight) / 50;
            results.push({ segments: [loc.slug, type.slug, budget.slug, intent.slug], score: t5score });
          }
        }
      }
    }
  }

  return results;
}

/**
 * Top 500 combos by priority score.
 * Format: `{ combo: string[] }` — used by generateStaticParams.
 */
export const STATIC_COMBO_PARAMS: { combo: string[] }[] = allCombos()
  .sort((a, b) => b.score - a.score)
  .slice(0, 500)
  .map((c) => ({ combo: c.segments }));

/**
 * All location-only combos (50 total) — always static regardless of score.
 */
export const LOCATION_ONLY_PARAMS: { combo: string[] }[] = SEO_LOCATIONS.map((l) => ({
  combo: [l.slug],
}));

/**
 * Full merged static params (union of top-500 scored + all location-only).
 * Deduplicated by href string.
 */
export const ALL_STATIC_COMBO_PARAMS: { combo: string[] }[] = (() => {
  const seen = new Set<string>();
  const merged = [...LOCATION_ONLY_PARAMS, ...STATIC_COMBO_PARAMS];
  return merged.filter((p) => {
    const key = p.combo.join("/");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
})();

/**
 * For sitemap generation: produces all valid combo hrefs in priority order.
 * Capped at 5,000 to keep sitemap generation fast.
 */
export function getComboSitemapBatch(batchIndex: number, batchSize = 2500): string[] {
  const allSorted = allCombos()
    .sort((a, b) => b.score - a.score)
    .slice(batchIndex * batchSize, (batchIndex + 1) * batchSize);
  return allSorted.map((c) => `/p/${c.segments.join("/")}`);
}

/**
 * Total number of generated combo pages (for sitemap index).
 */
export function getTotalComboBatches(batchSize = 2500): number {
  const total = allCombos().length;
  return Math.ceil(Math.min(total, 20000) / batchSize);
}
