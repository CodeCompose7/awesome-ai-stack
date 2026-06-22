# ⚡ awesome-agent-stack

A curated stack of the tools and services you actually use to build **AI agents** —
frameworks, LLM providers, vector stores, observability, and more.

Inspired by lists like [kyrolabs/awesome-agents](https://github.com/kyrolabs/awesome-agents),
but it's **not just a flat list**:

1. **A real website**, not a giant README — built with [Astro](https://astro.build) from Markdown/MDX.
2. **A detail page per service** — overview, links, metadata (language, license, pricing), and when to use it.
3. **Runnable sample code** on every page, so you can go from "what is this" to "show me" in one scroll.

Live site: <https://codecompose7.github.io/awesome-agent-stack>

---

## Tech stack

| Concern        | Choice                                             |
| -------------- | -------------------------------------------------- |
| Site framework | Astro 5 (static output)                            |
| Content        | MDX via `@astrojs/mdx` + content collections       |
| Styling        | Tailwind CSS v4 (`@tailwindcss/vite`)              |
| SEO            | `@astrojs/sitemap`                                 |
| i18n           | Astro i18n (`en` default, `ko` ready)              |
| Hosting        | GitHub Pages (see `.github/workflows/deploy.yml`)  |
| Tooling        | Node 24 + pnpm (devcontainer included)             |

## Getting started

Requires **Node ≥ 20** (the devcontainer uses Node 24) and **pnpm**.

```bash
pnpm install      # install dependencies
pnpm dev          # start the dev server at http://localhost:4321
pnpm build        # build the static site to dist/
pnpm preview      # preview the production build locally
pnpm check        # type-check Astro + content collections
```

> **Using VS Code / Dev Containers?** Open the folder and "Reopen in Container".
> The devcontainer (`.devcontainer/`) provisions Node 24, enables pnpm via Corepack,
> runs `pnpm install`, and forwards the Astro port (4321).

### A note on pnpm build scripts

pnpm 10+ does not run dependency build scripts unless they are allow-listed.
Astro needs `esbuild` and `sharp`, so they are approved in
[`pnpm-workspace.yaml`](pnpm-workspace.yaml). If you add a dependency that needs
a postinstall step, add it there.

## Project structure

```
src/
├─ content.config.ts            # schemas for the "stacks" and "articles" collections
├─ content/
│  ├─ stacks/{en,ko}/*.mdx      # one tool per locale   ← add a tool here
│  └─ articles/{en,ko}/*.mdx    # writing/blog posts    ← add an article here
├─ data/categories.ts           # category ids + per-locale labels/descriptions
├─ i18n/ui.ts                   # languages, UI strings, t() translator
├─ lib/
│  ├─ stacks.ts                 # getStacks(lang) / slugOf()
│  └─ articles.ts               # getArticles(lang) / getArticlesForTool() (backlinks)
├─ layouts/BaseLayout.astro     # shared shell (header/footer/lang dropdown)
├─ components/
│  ├─ Home.astro / StackCard / StackDetail.astro      # tool catalog
│  ├─ BlogIndex / ArticleCard / ArticleDetail.astro   # writing
│  └─ LanguageSwitcher.astro    # language dropdown
├─ pages/
│  ├─ index.astro · stacks/[...id].astro · blog/…      # EN  →  /, /stacks/…, /blog/…
│  └─ ko/…                       # KO  →  /ko/, /ko/stacks/…, /ko/blog/…
└─ styles/global.css            # Tailwind import + Markdown ("prose") styles
```

## Internationalization (EN / KO)

The site is bilingual. `en` is the default locale (served at the root) and `ko`
is served under `/ko/` — configured via Astro's `i18n` in
[`astro.config.mjs`](astro.config.mjs). A language toggle in the header links to
the same page in the other locale.

- **UI strings** live in [`src/i18n/ui.ts`](src/i18n/ui.ts) (the `ui` dictionary).
- **Category labels** are per-locale in [`src/data/categories.ts`](src/data/categories.ts).
- **Tool content** is one MDX file per locale: `content/stacks/en/<slug>.mdx`
  and `content/stacks/ko/<slug>.mdx`. Keep the **same slug** in both so the
  switcher lines up; code samples are usually identical, only prose is translated.

## Live data (GitHub stars & version)

Cards and detail pages show a star count and the latest version for any tool
with a `repo` on GitHub — **fetched at build time**, not hand-entered. The logic
lives in [`src/lib/github.ts`](src/lib/github.ts) (memoized per repo; degrades
to nothing on error/offline/rate-limit).

- These reflect the project's real state **as of the last build**. The deploy
  workflow runs on every push **and on a daily `schedule:` cron**, so numbers
  stay fresh without code changes.
- CI passes `GITHUB_TOKEN` to the build to lift the 60 req/hour unauthenticated
  rate limit. Locally, unauthenticated requests are usually plenty.
- For tools not on GitHub (e.g. a closed SaaS), set `version:` in frontmatter as
  a manual fallback; the live release wins whenever `repo` is present.

## Writing (blog) & backlinks

Articles live in the separate `articles` collection (`content/articles/{en,ko}/`)
and render under `/blog/` — kept apart from the tool catalog. An article's
frontmatter lists the tool slugs it references:

```mdx
---
title: 'Langfuse vs LangSmith: choosing an LLM observability stack'
description: One-line summary for the card and <head>.
date: 2026-06-22
tools: [langfuse, langsmith]   # stack slugs this article references
tags: [observability, comparison]
draft: false                   # optional; drafts are excluded from the build
---
```

That single `tools` list powers links in **both** directions:

- **Forward** (article → tool): `ArticleDetail` resolves each slug to the tool's
  localized name and links to its page. In prose you can also link with a
  base-independent relative path, e.g. `[Langfuse](../../stacks/langfuse/)`.
- **Backlink** (tool → article): Astro has **no native backlinks**, so
  [`getArticlesForTool()`](src/lib/articles.ts) computes the reverse lookup at
  build time — `StackDetail` then shows a "Related writing" list of every
  article whose `tools` includes that slug. Add the slug to an article and the
  backlink appears automatically; nothing to maintain by hand.

## Adding a tool

Drop one MDX file per locale into `src/content/stacks/en/` and
`src/content/stacks/ko/` (use the **same filename** in both). The filename
becomes the URL slug (`langgraph.mdx` → `/stacks/langgraph/` and
`/ko/stacks/langgraph/`).

```mdx
---
name: LangGraph
category: frameworks          # must match an id in src/data/categories.ts
description: One-line summary shown on the card and detail header.
logo: /logos/langgraph.svg    # optional image; otherwise a colored monogram is generated
website: https://example.com  # optional
repo: https://github.com/...  # optional
docs: https://docs.example.com # optional
tags: [orchestration, python] # optional
language: Python / JS         # optional
license: MIT                  # optional; shown as a chip on cards + detail
pricing: [open-source, paid]  # optional list: open-source | free-tier | paid | free
version: 0.2.1                # optional fallback; the live GitHub release is used when `repo` is set
featured: true                # optional: sorts first within its category
---

## Overview

Explain what it is and why it matters for building agents.

## Sample: <what it does>

​```ts
// Short, runnable snippet — the differentiator. Keep it focused.
​```

## When to use it

A sentence or two on the sweet spot.
```

The frontmatter is validated at build time by the Zod schema in
[`src/content.config.ts`](src/content.config.ts) — a typo or missing required
field fails `pnpm build` and `pnpm check`, so broken entries can't ship.

To add a **new category**, append it to
[`src/data/categories.ts`](src/data/categories.ts); homepage sections render in
that order.

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds with Astro and publishes to GitHub Pages. The `site` and `base` are
configured in [`astro.config.mjs`](astro.config.mjs) for a GitHub project page; to
use a custom domain, set `site` to the domain, `base` to `'/'`, and add `public/CNAME`.

## Contributing

PRs that add tools, improve samples, or fix metadata are welcome. Please run
`pnpm check` before opening a PR so the content schema stays green.
