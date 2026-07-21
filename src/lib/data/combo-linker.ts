/**
 * combo-linker.ts
 *
 * Internal Linking Engine.
 *
 * Takes a ParsedCombo and returns clusters of related page hrefs
 * for the internal link grid at the bottom of every ProgrammaticPage.
 *
 * Implements the "Related Pages" architecture from the SEO plan:
 *   - Same location + different BHK
 *   - Same type + different location
 *   - Same budget + different location/type
 *   - Sibling BHK (±1)
 *   - Sibling budget (adjacent range)
 *   - Pillar page link (parent /ahmedabad/[type])
 */

import {
  SEO_LOCATIONS,
  SEO_PROPERTY_TYPES,
  SEO_BHK_OPTIONS,
  SEO_BUDGET_RANGES,
  SEO_INTENTS,
  buildComboHref,
  type ParsedCombo,
  type SeoDimLocation,
  type SeoDimPropertyType,
  type SeoDimBhk,
  type SeoDimBudget,
  type SeoDimIntent,
} from "@/lib/data/seo-dimensions";

export interface RelatedComboLink {
  href: string;
  label: string;
  description: string;
}

export interface RelatedLinksCluster {
  heading: string;
  links: RelatedComboLink[];
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function makeLink(
  combo: Partial<ParsedCombo>,
  label: string,
  description: string
): RelatedComboLink {
  return { href: buildComboHref(combo), label, description };
}

/** Returns the top N locations by weight, excluding the current one. */
function topLocations(exclude: string, n = 4): SeoDimLocation[] {
  return SEO_LOCATIONS.filter((l) => l.slug !== exclude)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, n);
}

/** Returns the top N property types by weight, excluding the current one. */
function topTypes(exclude: string | undefined, n = 3): SeoDimPropertyType[] {
  return SEO_PROPERTY_TYPES.filter((t) => t.slug !== exclude)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, n);
}

/** Returns BHK options for the same type, excluding the current one. */
function siblingBhk(
  currentBhk: SeoDimBhk | undefined,
  type: SeoDimPropertyType | undefined
): SeoDimBhk[] {
  if (!type?.bhkApplicable) return [];
  return SEO_BHK_OPTIONS.filter((b) => b.slug !== currentBhk?.slug).slice(0, 3);
}

/** Returns adjacent budget ranges (one above, one below). */
function siblingBudgets(current: SeoDimBudget | undefined): SeoDimBudget[] {
  if (!current) return SEO_BUDGET_RANGES.slice(0, 3);
  const idx = SEO_BUDGET_RANGES.findIndex((b) => b.slug === current.slug);
  const result: SeoDimBudget[] = [];
  if (idx > 0) result.push(SEO_BUDGET_RANGES[idx - 1]);
  if (idx < SEO_BUDGET_RANGES.length - 1) result.push(SEO_BUDGET_RANGES[idx + 1]);
  return result;
}

/** Returns the same-corridor locations (excluding current). */
function corridorLocations(
  current: SeoDimLocation,
  n = 3
): SeoDimLocation[] {
  return SEO_LOCATIONS.filter(
    (l) => l.slug !== current.slug && l.corridor === current.corridor
  )
    .sort((a, b) => b.weight - a.weight)
    .slice(0, n);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN LINKER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns an array of related link clusters for the given combo.
 * Maximum 5 clusters, 3–4 links each.
 */
export function getRelatedCombos(combo: ParsedCombo): RelatedLinksCluster[] {
  const loc = combo.location;
  const type = combo.type;
  const bhk = combo.bhk;
  const budget = combo.budget;
  const intent = combo.intent;

  if (!loc) return [];

  const clusters: RelatedLinksCluster[] = [];

  // ── 1. Same location, different BHK ────────────────────────────────────────
  if (type?.bhkApplicable) {
    const otherBhks = siblingBhk(bhk, type);
    if (otherBhks.length > 0) {
      clusters.push({
        heading: `Other configurations in ${loc.label}`,
        links: otherBhks.map((b) =>
          makeLink(
            { location: loc, type, bhk: b, budget, intent },
            `${b.label} ${type.pluralLabel} in ${loc.label}`,
            b.marketNote
          )
        ),
      });
    }
  }

  // ── 2. Same type, nearby corridor locations ─────────────────────────────────
  if (type) {
    const nearbyLocs = corridorLocations(loc, 4);
    if (nearbyLocs.length > 0) {
      clusters.push({
        heading: `${type.pluralLabel} in nearby areas`,
        links: nearbyLocs.map((l) =>
          makeLink(
            { location: l, type, bhk, budget, intent },
            `${type.pluralLabel} in ${l.label}`,
            l.marketNote
          )
        ),
      });
    }
  }

  // ── 3. Same location, adjacent budget ranges ────────────────────────────────
  const adjacentBudgets = siblingBudgets(budget);
  if (adjacentBudgets.length > 0) {
    clusters.push({
      heading: `${budget ? "Adjacent budgets" : "Browse by budget"} in ${loc.label}`,
      links: adjacentBudgets.map((b) =>
        makeLink(
          { location: loc, type, bhk, budget: b, intent },
          `${type ? type.pluralLabel + " " : ""}${b.label} in ${loc.label}`,
          b.marketNote
        )
      ),
    });
  }

  // ── 4. Same location, all intents ──────────────────────────────────────────
  if (!intent) {
    const intentLinks = SEO_INTENTS.slice(0, 4).map((i) =>
      makeLink(
        { location: loc, type, bhk, budget, intent: i },
        `${loc.label} ${type ? type.pluralLabel : "Properties"} — ${i.label}`,
        i.buyerProfile
      )
    );
    clusters.push({
      heading: `Browse by buyer intent in ${loc.label}`,
      links: intentLinks,
    });
  } else {
    // Same intent, top locations
    const topLocs = topLocations(loc.slug, 4);
    clusters.push({
      heading: `${intent.label} properties in other areas`,
      links: topLocs.map((l) =>
        makeLink(
          { location: l, type, bhk, budget, intent },
          `${type ? type.pluralLabel + " " : ""}${intent.label} in ${l.label}`,
          l.marketNote
        )
      ),
    });
  }

  // ── 5. Pillar / parent page links ──────────────────────────────────────────
  const pillarLinks: RelatedComboLink[] = [];

  // Location hub
  pillarLinks.push({
    href: `/p/${loc.slug}`,
    label: `All Properties in ${loc.label}`,
    description: `Browse all property types and configurations in ${loc.label}.`,
  });

  // Type pillar
  if (type) {
    pillarLinks.push({
      href: `/ahmedabad/${type.slug}`,
      label: `All ${type.pluralLabel} in Ahmedabad`,
      description: `PIKORUA's full ${type.pluralLabel.toLowerCase()} advisory for Ahmedabad.`,
    });
  }

  // Top locations without type filter
  const otherTopLocs = topLocations(loc.slug, 2);
  otherTopLocs.forEach((l) => {
    pillarLinks.push({
      href: `/p/${l.slug}`,
      label: `Properties in ${l.label}`,
      description: l.marketNote,
    });
  });

  if (pillarLinks.length > 0) {
    clusters.push({ heading: "Explore more", links: pillarLinks.slice(0, 4) });
  }

  return clusters;
}
