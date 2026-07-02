// @ts-check
/**
 * Central glossary for `[[Term]]` wikilinks used in MDX bodies. One entry per
 * term, keyed by a lowercase id — `[[LangGraph]]` and `[[langgraph]]` both
 * resolve to the `langgraph` entry. The `remarkGlossary` plugin (astro.config.mjs)
 * turns each marker into a link at build time, and an unknown term fails the
 * build (so a typo can't silently render as plain text).
 *
 * The link target is a slug/href — never a hardcoded path — so links stay correct
 * across locales (`/ko`, `/en`) and survive route changes. Internal targets emit
 * the same `../../stack/<slug>/` relative form the articles already use, which is
 * locale- and base-agnostic. "Promoting" a term to its own page is a one-line
 * edit here (swap `href` for `stack`/`concept`); the `[[Term]]` markers never change.
 *
 * Authoring:
 *   [[LangGraph]]              → LangGraph, linked (canonical label + casing)
 *   [[langgraph]]              → same (lookup is case-insensitive)
 *   [[langgraph|그 프레임워크]] → custom link text, same target
 *
 * @typedef {string | { ko: string; en: string }} Label
 * @typedef {Object} GlossaryEntry
 * @property {Label} label      Display text. Brand names are one string; terms
 *                              whose wording differs by locale use `{ ko, en }`.
 * @property {string} [stack]   Catalog stack slug  → `../../stack/<slug>/`.
 * @property {string} [concept] Concept slug        → `../../concept/<slug>/`.
 * @property {string} [href]    External absolute URL (a term without a page yet).
 */

/** @type {Record<string, GlossaryEntry>} */
export const glossary = {
  langgraph: { label: 'LangGraph', stack: 'langgraph' },
  firecrawl: { label: 'Firecrawl', stack: 'firecrawl' },
  litellm: { label: 'LiteLLM', stack: 'litellm' },
  tavily: { label: 'Tavily', stack: 'tavily' },
  docker: { label: 'Docker', stack: 'docker' },
};
