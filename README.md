# ⚡ awesome-ai-stack

**English** | [한국어](docs/readme/README.ko.md)

A curated stack of the tools and services you actually use to build **AI systems** —
frameworks, LLM providers, vector stores, serving, observability, and more.

Inspired by lists like [kyrolabs/awesome-agents](https://github.com/kyrolabs/awesome-agents),
but it's **not just a flat list**:

1. **A real website**, not a giant README — built with [Astro](https://astro.build) from Markdown/MDX.
2. **A detail page per service** — overview, links, metadata (language, license, pricing), and when to use it.
3. **Runnable sample code** on every page, so you can go from "what is this" to "show me" in one scroll.

Live site: <https://codecompose7.github.io/awesome-ai-stack>

---

## Tech stack

| Concern        | Choice                                             |
| -------------- | -------------------------------------------------- |
| Site framework | Astro 5 (static output)                            |
| Content        | MDX via `@astrojs/mdx` + content collections       |
| Styling        | Tailwind CSS v4 (`@tailwindcss/vite`)              |
| SEO            | `@astrojs/sitemap`                                 |
| i18n           | Astro i18n (`en` default, `ko` under `/ko/`)       |
| Theme          | [`stack-site-builder`](https://www.npmjs.com/package/stack-site-builder) from npm |
| Hosting        | GitHub Pages (see `.github/workflows/deploy.yml`)  |
| Tooling        | Node 24 + pnpm (devcontainer included)             |

## Getting started

**Quickest — clone and run, nothing to install but Docker:**

```bash
docker compose up      # builds a self-contained image, serves the site
```

Then open <http://localhost:4321/awesome-ai-stack/>. Deps and source are baked
into the image ([`Dockerfile.dev`](Dockerfile.dev) +
[`docker-compose.yml`](docker-compose.yml)), so this works on a fresh clone with
nothing else installed. It runs the **dev server** — the production site is the
static build from the deploy workflow, not this image. The compose file also
mounts the Docker socket so the sample **run** wizard can build and run the
[`samples/`](samples/) projects; drop that line if you don't use it or aren't on
Linux/macOS.

**Editing content — hot-reload your working tree (a lighter alternative to the
devcontainer):**

```bash
docker compose -f docker-compose.dev.yml up
```

Same URL, but your working tree is bind-mounted, so edits on your machine
hot-reload in the container ([`docker-compose.dev.yml`](docker-compose.dev.yml)) —
otherwise identical to the default (same image, same Docker socket for the run
wizard).

**Snapshot vs. live edit — why your edits might not show.** The default image
_bakes_ the source in, so `docker compose up` serves a **snapshot**: edits on your
host don't appear until you rebuild it with `docker compose up --build`. Use the
dev compose above for an edit-and-refresh loop instead — it bind-mounts your
working tree, so changes show on the next browser reload with no rebuild
(`src/content` hot-reloads via HMR; the `samples/` files are re-read fresh per
request by the run wizard).

**Or with Node locally** (Node ≥ 20; the devcontainer uses Node 24) and **pnpm**:

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

## Content model: three collections

Everything on the site is driven by three MDX content collections, all
locale-partitioned (`en/` and `ko/` subfolders, same filename in both):

| Collection | Lives in                    | Renders at            | What it is                                                        |
| ---------- | --------------------------- | --------------------- | ----------------------------------------------------------------- |
| `stacks`   | `<site>/src/content/stacks/`       | `/stack/<slug>/`      | The catalog — one entry per tool/service                          |
| `concepts` | `<site>/src/content/concepts/`     | `/concept/<slug>/`    | Higher-level patterns that compose several tools (living docs)    |
| `articles` | `<site>/src/content/articles/`     | `/article/<slug>/`    | Writing — long-form posts, kept apart from the catalog            |

Frontmatter for all three is validated at build time by the Zod schemas in
[`stack-site-builder/src/content.ts`](https://github.com/CodeCompose7/stack-site-builder/blob/main/src/content.ts) — shared by every
site via `defineAasCollections()`. A typo or missing required field fails
`pnpm build` and `pnpm check`, so broken entries can't ship.

Beyond the detail pages there are **browse pages**, all generated from the same
frontmatter: `/categories/<id>/` (tool category tree), `/concept/category/<id>/`
and `/article/category/<id>/` (their own taxonomies), `/tags/<tag>/`,
`/vendors/<vendor>/`, and a searchable `/glossary/`.

## One theme, many sites

Everything site-agnostic — routes, components, styles, the markdown pipeline,
content schemas — lives in the [`stack-site-builder`](https://github.com/CodeCompose7/stack-site-builder)
theme, installed from npm. This repo supplies only what makes it *this* site:
content, taxonomy data, identity and a small config. Another catalog on the
same engine is just another thin repo depending on the theme; theme updates
arrive as ordinary version upgrades (`pnpm up stack-site-builder`).

## Project structure

```text
astro.config.mjs                # site/base/i18n + aasTheme({ glossary }) — the theme does the rest
src/
├─ content.config.ts            # one call: defineAasCollections({ categoryMap })
├─ content/
│  ├─ stacks/{en,ko}/*.mdx      # one tool per locale       ← add a tool here
│  ├─ concepts/{en,ko}/*.mdx    # composed patterns         ← add a concept here
│  ├─ articles/{en,ko}/*.mdx    # writing/blog posts        ← add an article here
│  └─ slides/{en,ko}/*.mdx      # presentation decks
├─ data/
│  ├─ site.ts                   # site identity: name, repo URL, UI string overrides
│  ├─ categories.ts             # tool category TREE (nested children, per-locale labels)
│  ├─ concept-categories.ts     # concept taxonomy
│  ├─ article-categories.ts     # article taxonomy
│  └─ glossary.mjs              # [[Term]] wikilink glossary (see below)
└─ assets/                      # in-body images (@assets/... alias)
public/logos/                   # tool logos
samples/                        # runnable mini-projects (Implementation tabs)
```

## Internationalization (EN / KO)

The site is bilingual. `en` is the default locale (served at the root) and `ko`
is served under `/ko/` — configured via Astro's `i18n` in
[`astro.config.mjs`](astro.config.mjs). A language toggle in the header links to
the same page in the other locale.

- **UI strings** live in [`src/i18n/ui.ts`](https://github.com/CodeCompose7/stack-site-builder/blob/main/src/i18n/ui.ts) (the `ui` dictionary).
- **Category labels** are per-locale in [`src/data/categories.ts`](src/data/categories.ts)
  (and the concept/article taxonomies alongside it).
- **Content** is one MDX file per locale: `content/<collection>/en/<slug>.mdx`
  and `content/<collection>/ko/<slug>.mdx`. Keep the **same slug** in both so the
  switcher lines up; code samples are usually identical, only prose is translated.

## Detail tabs: overview + versioned code samples

When a tool defines `samples` in frontmatter, its detail page splits into tabs:
**Overview** (the MDX body — prose + diagrams) and **Code samples** (a version
selector over the snippets). See `content/stacks/{en,ko}/langgraph.mdx` for a
worked example.

```yaml
samples:
  - version: "0.2 · Graph API"   # label shown in the selector
    lang: python                 # syntax-highlight language (Shiki, build-time)
    description: |               # optional Markdown explanation, shown above the code
      The **graph API** is explicit: nodes plus the edges between them.
    diagram: |                   # optional Mermaid structure diagram
      flowchart LR
        START([START]) --> think[think]
    code: |
      from langgraph.graph import StateGraph
      ...
    note: One-line caption under the code.       # optional
```

Detail pages also render a sticky right-rail **table of contents** (h2–h3, from
`render()`'s `headings`); on the Code tab it becomes the version list.

### Runnable samples (the "Implementation" tab)

Beyond the illustrative code samples, a tool can ship one or more **real,
runnable mini-projects** as standalone folders under `samples/` (source, a
`Dockerfile`, and a README — e.g. [`samples/langgraph_1/`](samples/langgraph_1/)).
List them in frontmatter — a bare folder name, or an object that also names the
other catalog tools the project uses:

```yaml
projects: [langgraph_1, langgraph_2]
# or, with related tools for the sidebar:
projects:
  - folder: langgraph_1
    related: [langgraph, litellm]
```

The detail page then shows an **Implementation** tab
([`ProjectViewer`](https://github.com/CodeCompose7/stack-site-builder/blob/main/src/components/ProjectViewer.astro)) where, per project,
[`src/lib/project.ts`](https://github.com/CodeCompose7/stack-site-builder/blob/main/src/lib/project.ts) (at build time):

- renders the `README.md` as prose (its first `#` heading becomes the project name),
- shows a **file tree** on the left; clicking a file shows it syntax-highlighted,
- links to the folder on GitHub.

With multiple `projects`, an **Example** dropdown switches between them. GitHub
Pages can't execute the code — visitors download a folder and run it with Docker
(`docker build`, then `docker run --env-file .env` as each sample's README shows).
An article can embed the same viewer for its own sample via the `project`
frontmatter field and `<SampleProject folder="…"/>`.

- **Mermaid** diagrams work both in the Overview body (a ```mermaid fenced
  block) and per-sample via `diagram:`. They render on the client and recolor
  with the light/dark theme ([`MermaidLoader.astro`](https://github.com/CodeCompose7/stack-site-builder/blob/main/src/components/MermaidLoader.astro)).
- Code is highlighted at **build time** with Shiki.
- Tools without `samples` render the MDX body directly (no tabs), so adopting
  this per tool is optional and incremental.

## Live data (GitHub stars & version)

Cards and detail pages show a star count and the latest version for any tool
with a `repo` on GitHub — **fetched at build time**, not hand-entered. The logic
lives in [`src/lib/github.ts`](https://github.com/CodeCompose7/stack-site-builder/blob/main/src/lib/github.ts) (memoized per repo, cached
~daily in `.aas-cache/`; degrades to the last known values on error/offline/rate-limit).

- These reflect the project's real state **as of the last build**. The deploy
  workflow runs on every push **and on a daily `schedule:` cron**, so numbers
  stay fresh without code changes.
- CI passes `GITHUB_TOKEN` to the build to lift the 60 req/hour unauthenticated
  rate limit. Locally, unauthenticated requests are usually plenty.
- For tools not on GitHub (e.g. a closed SaaS), set `version:` in frontmatter as
  a manual fallback; the live release wins whenever `repo` is present.

## Glossary & `[[Term]]` wikilinks

Prose in any collection can link a term with `[[Term]]` (or
`[[Term|display text]]`). The `remarkGlossary` plugin in
[`astro.config.mjs`](astro.config.mjs) resolves each marker against the central
glossary ([`src/data/glossary.mjs`](src/data/glossary.mjs)) at build time:

- A term targets a **stack**, a **concept**, an external **href**, or nothing —
  a definition-only term, which links to its entry on the `/glossary/` page.
- Lookup is locale-aware: `[[도구]]`, `[[Tools]]`, and `[[agent-tools]]` all
  resolve to the same entry, rendering the label for the page's locale.
- An **unknown term fails the build**, so a typo can't silently render as text.
- The `/glossary/` page lists every term with search and category grouping.

## Writing (blog) & backlinks

Articles live in the separate `articles` collection (`content/articles/{en,ko}/`)
and render under `/article/` — kept apart from the tool catalog. An article's
frontmatter lists the tool slugs it references:

```mdx
---
title: 'Langfuse vs LangSmith: choosing an LLM observability stack'
description: One-line summary for the card and <head>.
date: 2026-06-22
category: article-comparisons  # leaf id from src/data/article-categories.ts
tools: [langfuse, langsmith]   # stack slugs this article references
tags: [observability, comparison]
draft: false                   # optional; drafts are excluded from the build
---
```

That single `tools` list powers links in **both** directions:

- **Forward** (article → tool): `ArticleDetail` resolves each slug to the tool's
  localized name and links to its page. In prose you can also link with a
  base-independent relative path, e.g. `[Langfuse](../../stack/langfuse/)` —
  or just write `[[Langfuse]]` and let the glossary resolve it.
- **Backlink** (tool → article): Astro has **no native backlinks**, so
  [`getArticlesForTool()`](https://github.com/CodeCompose7/stack-site-builder/blob/main/src/lib/articles.ts) computes the reverse lookup at
  build time — `StackDetail` then shows a "Related writing" list of every
  article whose `tools` includes that slug. Add the slug to an article and the
  backlink appears automatically; nothing to maintain by hand.

Concepts work the same way in reverse: a concept's `tools` (grouped by role) and
`articles` frontmatter link it to catalog entries and posts, and those pages
link back.

## Adding a tool

Drop one MDX file per locale into `src/content/stacks/en/` and
`src/content/stacks/ko/` (use the **same filename** in both). The filename
becomes the URL slug (`langgraph.mdx` → `/stack/langgraph/` and
`/ko/stack/langgraph/`).

```mdx
---
name: LangGraph
category: framework-orchestration  # id of any node in src/data/categories.ts (tree)
description: One-line summary shown on the card and detail header.
vendor: LangChain             # optional; powers /vendors/<slug> browse pages
logo: /logos/langgraph.svg    # optional image; otherwise a colored monogram is generated
website: https://example.com  # optional
repo: https://github.com/...  # optional; enables live stars/version
docs: https://docs.example.com # optional
tags: [orchestration, python] # optional; powers /tags/<tag> pages
language: Python / JS         # optional
license: MIT                  # optional; shown as a chip on cards + detail
pricing: [open-source, paid]  # optional list: open-source | free-tier | paid | free
version: 0.2.1                # optional fallback; the live GitHub release wins when `repo` is set
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

The schema ([`stack-site-builder/src/content.ts`](https://github.com/CodeCompose7/stack-site-builder/blob/main/src/content.ts)) supports more
when you need it: `formerNames`, `pricingTiers`/`pricingNote`/`pricingSource`,
`related` tools, `deprecated`, `docVersion`/`updated`, and the `samples`/
`projects` fields described above.

To add a **new category**, add a node to the tree in
[`src/data/categories.ts`](src/data/categories.ts) — top-level or nested under
`children`; ids must be unique across the whole tree. Homepage sections render
in top-level order.

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds with Astro and publishes to GitHub Pages (it also runs on a daily
cron to refresh the live GitHub stats). The `site` and `base` are configured in
[`astro.config.mjs`](astro.config.mjs) for a GitHub project page; to use a
custom domain, set `site` to the domain, `base` to `'/'`, and add `public/CNAME`.

## Contributing

PRs that add tools, improve samples, or fix metadata are welcome. Please run
`pnpm check` before opening a PR so the content schema stays green.
