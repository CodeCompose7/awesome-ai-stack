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
├─ content.config.ts        # schema for the "stacks" collection (frontmatter)
├─ content/stacks/*.mdx      # one file per tool/service  ← add entries here
├─ data/categories.ts        # category ids, labels, and ordering
├─ layouts/BaseLayout.astro  # shared page shell (header/footer/styles)
├─ components/StackCard.astro # card used on the homepage grid
├─ pages/
│  ├─ index.astro            # homepage, grouped by category
│  └─ stacks/[...id].astro   # detail page generated per entry
└─ styles/global.css         # Tailwind import + Markdown ("prose") styles
```

## Adding a tool

Adding an entry is just dropping one MDX file into `src/content/stacks/`.
The filename becomes the URL slug (`langgraph.mdx` → `/stacks/langgraph/`).

```mdx
---
name: LangGraph
category: frameworks          # must match an id in src/data/categories.ts
description: One-line summary shown on the card and detail header.
website: https://example.com  # optional
repo: https://github.com/...  # optional
docs: https://docs.example.com # optional
tags: [orchestration, python] # optional
language: Python / JS         # optional
license: MIT                  # optional
pricing: open-source          # optional: open-source | free-tier | paid | freemium
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
