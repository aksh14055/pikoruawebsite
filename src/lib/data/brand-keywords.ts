/**
 * Search-only aliases for brand queries that are commonly mistyped.
 *
 * Keep these aliases attached to the canonical homepage/entity. They must never
 * be used as property match keywords or expanded into typo-specific pages.
 */
export const BRAND_MISSPELLING_CLUSTER = {
  canonical: "PIKORUA Realty",
  canonicalPath: "/",
  omittedLetters: ["pikora", "pikoru", "piku", "piru", "pikrua", "pikoua", "pikorua relty"],
  addedLetters: ["pikoruaa", "pikoraa", "pikkorua", "piikorua"],
  substitutions: [
    "picorua",
    "picora",
    "piqorua",
    "pikorva",
    "pikoriya",
    "pikoro",
    "pakora",
    "pikorua reality",
  ],
  transpositions: ["pikorau", "pikoura", "pikorua realyt", "pikorua relaity"],
  spacing: ["piko rua", "piko rua realty", "pik orua", "pikoru a"],
  domainAndLocation: [
    "pikorua com",
    "pikorua.com",
    "pikora com",
    "pikora.com",
    "pikoraa.com",
    "pikorua Ahmedabad",
    "pikora Ahmedabad",
  ],
} as const;

export const BRAND_MISSPELLING_KEYWORDS = Array.from(
  new Set(
    Object.entries(BRAND_MISSPELLING_CLUSTER)
      .filter(([, value]) => Array.isArray(value))
      .flatMap(([, value]) => value as readonly string[])
  )
);
