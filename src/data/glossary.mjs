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
 * A term needs exactly one link target — `stack`, `concept`, `article`, or `href` —
 * OR none, in which case it's a definition-only term (`def` required): its `[[Term]]`
 * links to its entry on the glossary page. `def` is an optional short definition shown
 * on the glossary card and as a hover tooltip on the `[[Term]]` link (any kind may set it).
 *
 * @typedef {string | { ko: string; en: string }} Label
 * @typedef {Object} GlossaryEntry
 * @property {Label} label      Display text. Brand names are one string; terms
 *                              whose wording differs by locale use `{ ko, en }`.
 * @property {string} [stack]   Catalog stack slug  → `../../stack/<slug>/`.
 * @property {string} [concept] Concept slug        → `../../concept/<slug>/`.
 * @property {string} [article] Article slug        → `../../article/<slug>/`.
 * @property {string} [href]    External absolute URL (a term without a page yet).
 * @property {Label}  [def]     Short definition (def-only terms need it; optional else).
 */

/** @type {Record<string, GlossaryEntry>} */
export const glossary = {
  langgraph: { label: 'LangGraph', stack: 'langgraph' },
  langchain: { label: 'LangChain', stack: 'langchain' },
  langsmith: { label: 'LangSmith', stack: 'langsmith' },
  firecrawl: { label: 'Firecrawl', stack: 'firecrawl' },
  litellm: { label: 'LiteLLM', stack: 'litellm' },
  tavily: { label: 'Tavily', stack: 'tavily' },
  docker: { label: 'Docker', stack: 'docker' },
  // Concept terms whose wording differs by locale: write [[도구]] / [[Tools]] /
  // [[agent-tools]] — all resolve here and render the label for the page's locale.
  'agent-tools': { label: { ko: '도구', en: 'Tools' }, concept: 'agent-tools' },
  // External term (links out, keeps a definition for the tooltip/card):
  react: {
    label: 'ReAct',
    href: 'https://arxiv.org/abs/2210.03629',
    def: {
      ko: '추론(Reason)과 행동(Act)을 번갈아 수행하는 에이전트 루프.',
      en: 'An agent loop that interleaves reasoning and acting (Reason + Act).',
    },
  },
  // Article terms — cross-reference a post from any body without hardcoding its
  // URL: [[code-sandbox-agent|코드 샌드박스]] renders the custom text, and a
  // renamed/moved article is a one-line fix here instead of a hunt for links.
  'code-sandbox-agent': {
    label: { ko: '코드 샌드박스 에이전트', en: 'Code-sandbox agent' },
    article: 'code-sandbox-agent',
  },
  'web-scraping-agent': {
    label: { ko: '웹 스크래핑 에이전트', en: 'Web-scraping agent' },
    article: 'web-scraping-agent',
  },
  'web-search-fx-agent': {
    label: { ko: '웹 검색 환율 에이전트', en: 'Web-search FX agent' },
    article: 'web-search-fx-agent',
  },
  'litellm-langgraph-vs-langchain': {
    label: { ko: 'LangChain 없이 만들면', en: 'Dropping LangChain' },
    article: 'litellm-langgraph-vs-langchain',
  },
  'code-sandbox-agent-direct': {
    label: { ko: '코드 샌드박스 에이전트 — 직접 배선', en: 'Code-sandbox agent, hand-wired' },
    article: 'code-sandbox-agent-direct',
  },
  // Definition-only term (no page — [[DooD]] links to its glossary entry):
  dood: {
    label: 'DooD',
    def: {
      ko: 'Docker-out-of-Docker — 컨테이너가 호스트의 Docker 소켓을 마운트해 형제 컨테이너를 띄우는 패턴.',
      en: 'Docker-out-of-Docker — a container mounts the host Docker socket to spawn sibling containers.',
    },
  },
};
