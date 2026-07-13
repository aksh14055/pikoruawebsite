import { AI_ANSWER_BLOCKS } from "../src/lib/ai/answer-blocks";
import { ALL_GEO_LANDING_PAGES } from "../src/lib/data/geo";
import { STATIC_BLOG_POSTS } from "../src/lib/data/blog";
import { STATIC_PROPERTIES } from "../src/lib/data/properties";

const STATIC_PUBLIC_ROUTES = [
  "/",
  "/about",
  "/blog",
  "/contact",
  "/privacy",
  "/properties",
  "/terms",
  "/testimonials",
  "/ai/facts.json",
  "/llms.txt",
  "/llms-full.txt",
] as const;

const MIN_ANSWER_LENGTH = 120;
const MIN_CITATION_FACTS = 2;

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
    ...STATIC_PROPERTIES.map((property) => `/properties/${property.slug}`),
    ...STATIC_BLOG_POSTS.map((post) => `/blog/${post.slug}`),
  ]);
}

function main() {
  const failures: string[] = [];
  const knownPublicRoutes = buildKnownPublicRoutes();
  const blockIds = new Set<string>();

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
