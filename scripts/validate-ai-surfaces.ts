import { AI_ANSWER_BLOCKS } from "../src/lib/ai/answer-blocks";
import { ALL_GEO_LANDING_PAGES, PROPERTY_TYPE_LANDING_PAGES } from "../src/lib/data/geo";
import { STATIC_BLOG_POSTS } from "../src/lib/data/blog";
import { STATIC_PROPERTIES } from "../src/lib/data/properties";
import { PROPERTY_TYPE_KEYWORD_CLUSTERS } from "../src/lib/data/keyword-clusters";
import { ALL_CONTENT_HUB_PAGES } from "../src/lib/data/content-hubs";
import { SIX_MONTH_PRIORITY_KEYWORDS } from "../src/lib/data/six-month-priority-keywords";
import {
  BRAND_MISSPELLING_CLUSTER,
  BRAND_MISSPELLING_KEYWORDS,
} from "../src/lib/data/brand-keywords";

const STATIC_PUBLIC_ROUTES = [
  "/",
  "/about",
  "/ahmedabad-luxury-property-market-report",
  "/blog",
  "/contact",
  "/press",
  "/private-client-advisory",
  "/private-property-advisory-public-figures",
  "/privacy",
  "/properties",
  "/property-types",
  "/terms",
  "/testimonials",
  "/ai/facts.json",
  "/llms.txt",
  "/llms-full.txt",
] as const;

const MIN_ANSWER_LENGTH = 120;
const MIN_CITATION_FACTS = 2;
const MIN_CLUSTER_PRIMARY_TERMS = 4;
const MIN_CLUSTER_TRANSACTIONAL_TERMS = 5;
const MIN_CLUSTER_LONG_TAIL_TERMS = 5;

function isValidDateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function addFailure(failures: string[], message: string) {
  failures.push(`- ${message}`);
}

function assertRoutePath(path: string, label: string, failures: string[]) {
  if (!path.startsWith("/")) {
    addFailure(failures, `${label} must be a root-relative path. Received: ${path}`);
  }

  if (path.length > 1 && path.endsWith("/")) {
    addFailure(failures, `${label} must not use a trailing slash. Received: ${path}`);
  }

  if (path.includes(" ")) {
    addFailure(failures, `${label} must not contain spaces. Received: ${path}`);
  }
}

function buildKnownPublicRoutes() {
  return new Set<string>([
    ...STATIC_PUBLIC_ROUTES,
    ...ALL_GEO_LANDING_PAGES.map((page) => page.href),
    ...ALL_CONTENT_HUB_PAGES.map((page) => page.href),
    ...STATIC_PROPERTIES.map((property) => `/properties/${property.slug}`),
    ...STATIC_BLOG_POSTS.map((post) => `/blog/${post.slug}`),
  ]);
}

function main() {
  const failures: string[] = [];
  const knownPublicRoutes = buildKnownPublicRoutes();
  const blockIds = new Set<string>();
  const keywordClusterSlugs = new Set(Object.keys(PROPERTY_TYPE_KEYWORD_CLUSTERS));
  const priorityKeywords = new Set<string>();

  if (BRAND_MISSPELLING_CLUSTER.canonicalPath !== "/") {
    addFailure(failures, "Brand misspelling cluster must resolve to the canonical homepage.");
  }

  if (BRAND_MISSPELLING_KEYWORDS.length < 20) {
    addFailure(
      failures,
      `Brand misspelling cluster is too thin. Expected at least 20 unique aliases; found ${BRAND_MISSPELLING_KEYWORDS.length}.`
    );
  }

  const normalizedBrandAliases = new Set<string>();
  for (const alias of BRAND_MISSPELLING_KEYWORDS) {
    const normalizedAlias = alias.trim().toLowerCase();
    if (!normalizedAlias) {
      addFailure(failures, "Brand misspelling cluster contains an empty alias.");
    } else if (normalizedBrandAliases.has(normalizedAlias)) {
      addFailure(failures, `Brand misspelling alias is duplicated: ${alias}`);
    }
    normalizedBrandAliases.add(normalizedAlias);
  }

  if (!normalizedBrandAliases.has("pikora")) {
    addFailure(failures, 'Brand misspelling cluster must include the observed query "pikora".');
  }

  if (SIX_MONTH_PRIORITY_KEYWORDS.length !== 38) {
    addFailure(
      failures,
      `Expected 38 six-month priority keywords. Found ${SIX_MONTH_PRIORITY_KEYWORDS.length}.`
    );
  }

  for (const target of SIX_MONTH_PRIORITY_KEYWORDS) {
    const normalizedKeyword = target.keyword.toLowerCase();
    if (priorityKeywords.has(normalizedKeyword)) {
      addFailure(failures, `Six-month priority keyword is duplicated: ${target.keyword}`);
    }
    priorityKeywords.add(normalizedKeyword);
    assertRoutePath(target.canonicalPath, `Priority keyword "${target.keyword}" canonicalPath`, failures);
    if (!knownPublicRoutes.has(target.canonicalPath)) {
      addFailure(
        failures,
        `Priority keyword "${target.keyword}" targets an unknown route: ${target.canonicalPath}`
      );
    }
    if (target.canonicalPath === "/") {
      addFailure(failures, `Priority keyword "${target.keyword}" must not target the homepage.`);
    }
  }

  if (AI_ANSWER_BLOCKS.length < 10) {
    addFailure(
      failures,
      `Expected at least 10 AI answer blocks for the current AEO surface. Found ${AI_ANSWER_BLOCKS.length}.`
    );
  }

  for (const block of AI_ANSWER_BLOCKS) {
    const prefix = `AI answer block "${block.id}"`;

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(block.id)) {
      addFailure(failures, `${prefix} id must be lowercase kebab-case.`);
    }

    if (blockIds.has(block.id)) {
      addFailure(failures, `${prefix} id is duplicated.`);
    }
    blockIds.add(block.id);

    if (!block.question.trim().endsWith("?")) {
      addFailure(failures, `${prefix} question must end with a question mark.`);
    }

    if (block.answer.trim().length < MIN_ANSWER_LENGTH) {
      addFailure(
        failures,
        `${prefix} answer is too thin for AI extraction. Minimum ${MIN_ANSWER_LENGTH} characters.`
      );
    }

    if (!Array.isArray(block.citationFacts) || block.citationFacts.length < MIN_CITATION_FACTS) {
      addFailure(
        failures,
        `${prefix} must include at least ${MIN_CITATION_FACTS} citation facts.`
      );
    }

    block.citationFacts.forEach((fact, index) => {
      if (fact.trim().length < 40) {
        addFailure(failures, `${prefix} citationFacts[${index}] is too short to be useful.`);
      }
    });

    assertRoutePath(block.sourcePath, `${prefix} sourcePath`, failures);
    if (!knownPublicRoutes.has(block.sourcePath)) {
      addFailure(failures, `${prefix} sourcePath is not in the known public route inventory: ${block.sourcePath}`);
    }

    if (block.supportingPaths.length < 2) {
      addFailure(failures, `${prefix} should include at least 2 supporting paths.`);
    }

    for (const supportingPath of block.supportingPaths) {
      assertRoutePath(supportingPath, `${prefix} supportingPath`, failures);
      if (!knownPublicRoutes.has(supportingPath)) {
        addFailure(
          failures,
          `${prefix} supportingPath is not in the known public route inventory: ${supportingPath}`
        );
      }
    }

    if (!isValidDateString(block.lastUpdated)) {
      addFailure(failures, `${prefix} lastUpdated must be a valid YYYY-MM-DD date.`);
    }
  }

  for (const page of PROPERTY_TYPE_LANDING_PAGES) {
    const prefix = `Property type keyword cluster "${page.slug}"`;
    const cluster = PROPERTY_TYPE_KEYWORD_CLUSTERS[page.slug as keyof typeof PROPERTY_TYPE_KEYWORD_CLUSTERS];

    if (!cluster) {
      addFailure(failures, `${prefix} is missing.`);
      continue;
    }

    keywordClusterSlugs.delete(page.slug);

    if (cluster.primary.length < MIN_CLUSTER_PRIMARY_TERMS) {
      addFailure(failures, `${prefix} must include at least ${MIN_CLUSTER_PRIMARY_TERMS} primary terms.`);
    }

    if (cluster.transactional.length < MIN_CLUSTER_TRANSACTIONAL_TERMS) {
      addFailure(
        failures,
        `${prefix} must include at least ${MIN_CLUSTER_TRANSACTIONAL_TERMS} transactional terms.`
      );
    }

    if (cluster.longTail.length < MIN_CLUSTER_LONG_TAIL_TERMS) {
      addFailure(failures, `${prefix} must include at least ${MIN_CLUSTER_LONG_TAIL_TERMS} long-tail terms.`);
    }

    if (cluster.nri.length < 3 || cluster.hni.length < 3) {
      addFailure(failures, `${prefix} must include at least 3 NRI and 3 HNI terms.`);
    }

    if (cluster.questions.length < 3 || cluster.comparisons.length < 2) {
      addFailure(failures, `${prefix} must include at least 3 questions and 2 comparison terms.`);
    }
  }

  for (const staleSlug of keywordClusterSlugs) {
    addFailure(failures, `Property type keyword cluster "${staleSlug}" does not match a current property type page.`);
  }

  if (failures.length > 0) {
    console.error("AI surface validation failed:");
    console.error(failures.join("\n"));
    process.exit(1);
  }

  console.log(
    `AI surface validation passed: ${AI_ANSWER_BLOCKS.length} answer blocks, ${knownPublicRoutes.size} known public routes.`
  );
}

main();
