// @ts-check
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import { glossary } from './src/data/glossary.mjs';

// Dev-only: serve the raw samples/<folder>/ files at /local-samples/… so the
// project viewer can offer a "view locally" link next to the GitHub one — the
// GitHub link only works once the branch is pushed. Directories render as a
// plain listing, files as text. Never active in `astro build` output.
function localSamples() {
  const root = resolve('samples');
  // Keep local-only noise (and real secrets — .env!) out of the listing and
  // unreachable, mirroring how the project viewer hides gitignored files.
  /** @param {string} name */
  const hidden = (name) =>
    name === '.env' || name === '__pycache__' || name === '.venv' || name.endsWith('.pyc');
  return {
    name: 'aas-local-samples',
    apply: /** @type {const} */ ('serve'),
    /** @param {any} server */
    configureServer(server) {
      server.middlewares.use((/** @type {any} */ req, /** @type {any} */ res, /** @type {any} */ next) => {
        const m = (req.url || '').match(/\/local-samples\/(.*)$/);
        if (!m) return next();
        const rel = decodeURIComponent(m[1].split('?')[0]);
        const target = resolve(root, rel);
        // Stay inside samples/ — reject traversal and hidden entries.
        if (target !== root && !target.startsWith(root + sep)) {
          res.statusCode = 403;
          return res.end('forbidden');
        }
        if (rel.split('/').some((part) => part && hidden(part))) {
          res.statusCode = 404;
          return res.end('not found');
        }
        if (!existsSync(target)) {
          res.statusCode = 404;
          return res.end('not found');
        }
        if (statSync(target).isDirectory()) {
          // Relative links in the listing need the trailing slash.
          if (!req.url?.split('?')[0].endsWith('/')) {
            res.statusCode = 301;
            res.setHeader('Location', req.url?.split('?')[0] + '/');
            return res.end();
          }
          const entries = readdirSync(target, { withFileTypes: true })
            .filter((e) => !hidden(e.name))
            .sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name));
          const fmtSize = (/** @type {number} */ n) =>
            n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;
          const rows = entries
            .map((e) => {
              const dir = e.isDirectory();
              const href = encodeURIComponent(e.name) + (dir ? '/' : '');
              const size = dir ? '' : fmtSize(statSync(resolve(target, e.name)).size);
              const icon = dir
                ? '<svg viewBox="0 0 24 24"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>'
                : '<svg viewBox="0 0 24 24"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>';
              return `<li><a href="${href}">${icon}<span class="name">${e.name}${dir ? '/' : ''}</span><span class="size">${size}</span></a></li>`;
            })
            .join('');
          // Breadcrumb: samples / <part> / <part> — each ancestor is a link.
          const parts = rel.split('/').filter(Boolean);
          const crumbs = [
            `<a href="${'../'.repeat(parts.length)}">samples</a>`,
            ...parts.map((p, i) =>
              i === parts.length - 1 ? `<b>${p}</b>` : `<a href="${'../'.repeat(parts.length - 1 - i)}">${p}</a>`,
            ),
          ].join('<span class="sep">/</span>');
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          return res.end(`<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>samples/${rel}</title>
<style>
  :root { --bg:#f8f8f7; --panel:#fff; --border:#e4e4e2; --text:#1c1c1a; --muted:#78786f; --tint:#f0f0ee; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#121212; --panel:#1c1c1c; --border:#2e2e2e; --text:#edede8; --muted:#9a9a90; --tint:#242424; }
  }
  * { box-sizing: border-box; margin: 0 }
  body { background: var(--bg); color: var(--text); min-height: 100vh; padding: 3rem 1.25rem;
         font-family: ui-sans-serif, system-ui, sans-serif; }
  main { max-width: 40rem; margin: 0 auto }
  .crumbs { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .95rem;
            color: var(--muted); display: flex; flex-wrap: wrap; gap: .4rem; align-items: baseline }
  .crumbs a { color: var(--muted); text-decoration: none }
  .crumbs a:hover { color: var(--text); text-decoration: underline }
  .crumbs b { color: var(--text) }
  .badge { margin-left: auto; font-size: .7rem; letter-spacing: .05em; text-transform: uppercase;
           color: var(--muted); border: 1px dashed var(--border); border-radius: .4rem; padding: .15rem .5rem }
  ul { list-style: none; margin-top: 1rem; border: 1px solid var(--border); border-radius: .75rem;
       background: var(--panel); overflow: hidden; padding: .3rem }
  li + li { margin-top: 2px }
  li a { display: flex; align-items: center; gap: .65rem; padding: .55rem .75rem; border-radius: .5rem;
         color: var(--text); text-decoration: none; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
         font-size: .9rem }
  li a:hover { background: var(--tint) }
  li svg { width: 15px; height: 15px; flex: none; fill: none; stroke: var(--muted);
           stroke-width: 2; stroke-linecap: round; stroke-linejoin: round }
  .name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap }
  .size { margin-left: auto; flex: none; font-size: .75rem; color: var(--muted) }
</style></head><body><main>
<div class="crumbs">${crumbs}<span class="badge">dev only</span></div>
<ul>${rows}</ul>
</main></body></html>`);
        }
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.end(readFileSync(target));
      });
    },
  };
}

// Prepend a "#" copy-link anchor to h2/h3/h4 headings (a global click handler
// in BaseLayout copies the section URL). The "#" count per level is drawn via
// CSS (h2 → #, h3 → ##, h4 → ###). The TOC still lists h2/h3 only. Runs after
// rehype-slug adds the ids.
function rehypeHeadingAnchors() {
  /** @param {any} node */
  const walk = (node) => {
    if (!node.children) return;
    for (const child of node.children) {
      if (
        child.type === 'element' &&
        (child.tagName === 'h2' || child.tagName === 'h3' || child.tagName === 'h4') &&
        child.properties &&
        child.properties.id
      ) {
        // Empty anchor — the visible "#" is drawn via CSS ::before so it does
        // not leak into Astro's extracted heading text (used by the TOC).
        child.children.unshift({
          type: 'element',
          tagName: 'a',
          properties: {
            className: ['aas-anchor'],
            href: '#' + child.properties.id,
            'aria-label': 'Copy link to section',
          },
          children: [],
        });
      } else {
        walk(child);
      }
    }
  };
  return (/** @type {any} */ tree) => walk(tree);
}

// Support explicit, stable heading ids written as `## Heading {#custom-id}`. The
// id is stripped from the visible text and set on the heading, so rehype-slug
// won't override it. Lets every locale share one anchor and keeps the anchor (and
// any external link to it) stable even when the heading wording changes.
function remarkHeadingIds() {
  const re = /\s*\{#([\w-]+)\}\s*$/;
  /** @param {any} node */
  const walk = (node) => {
    if (!node.children) return;
    for (const child of node.children) {
      if (child.type === 'heading' && child.children.length) {
        const last = child.children[child.children.length - 1];
        if (last && last.type === 'text') {
          const m = last.value.match(re);
          if (m) {
            last.value = last.value.replace(re, '');
            child.data = child.data || {};
            child.data.hProperties = { ...(child.data.hProperties || {}), id: m[1] };
          }
        }
      } else {
        walk(child);
      }
    }
  };
  return (/** @type {any} */ tree) => walk(tree);
}

// Turn ```mermaid fenced blocks into <pre class="mermaid"> (raw, un-highlighted)
// so the client-side mermaid loader can render them. Runs at the remark stage,
// before syntax highlighting, so Shiki leaves these blocks alone.
function remarkMermaid() {
  /** @param {string} s */
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  /** @param {any} node */
  const walk = (node) => {
    if (!node.children) return;
    node.children.forEach((/** @type {any} */ child, /** @type {number} */ i) => {
      if (child.type === 'code' && child.lang === 'mermaid') {
        node.children[i] = {
          type: 'html',
          value: `<div class="aas-diagram"><pre class="mermaid">${esc(child.value)}</pre></div>`,
        };
      } else {
        walk(child);
      }
    });
  };
  return (/** @type {any} */ tree) => walk(tree);
}

// Turn `[[Term]]` (and `[[Term|display text]]`) wikilinks into links, resolving
// each against the central glossary (src/data/glossary.mjs). Internal targets
// emit the `../../stack|concept/<slug>/` relative form (locale- and base-agnostic
// on the depth-3 detail routes); external `href` entries pass through and get
// target="_blank" from rehype-external-links downstream. An unknown term throws,
// failing the build so a typo can't silently degrade to plain text. Code spans
// and fenced blocks are untouched (mdast `inlineCode`/`code` carry no children).
function remarkGlossary() {
  const RE = /\[\[\s*([^\]|]+?)\s*(?:\|\s*([^\]]+?)\s*)?\]\]/g;
  /** @param {string} s */
  const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, '-');
  // Reverse index: an entry's id and each of its labels (any locale) all resolve
  // to that entry, so authors can write the natural word in either language —
  // [[도구]] / [[Tools]] — or the id ([[agent-tools]]). Ambiguity fails the build.
  /** @type {Record<string, string>} */
  const lookup = {};
  /** @param {string} name @param {string} id */
  const register = (name, id) => {
    const k = norm(name);
    if (lookup[k] && lookup[k] !== id)
      throw new Error(`[glossary] ambiguous term "${k}" maps to both "${lookup[k]}" and "${id}"`);
    lookup[k] = id;
  };
  for (const [id, e] of Object.entries(glossary)) {
    register(id, id);
    if (typeof e.label === 'string') register(e.label, id);
    else {
      register(e.label.ko, id);
      register(e.label.en, id);
    }
  }
  /** @param {any} tree @param {any} file */
  return (tree, file) => {
    const path = (file && (file.path || (file.history && file.history[0]))) || '';
    const lang = /[/\\]ko[/\\]/.test(path) ? 'ko' : 'en';
    /** @param {any} l */
    const labelOf = (l) => (typeof l === 'string' ? l : l[lang]);
    /** @param {any} node */
    const walk = (node) => {
      if (!node.children) return;
      /** @type {any[]} */
      const out = [];
      for (const child of node.children) {
        if (child.type === 'text' && child.value.includes('[[')) {
          let last = 0;
          let m;
          RE.lastIndex = 0;
          while ((m = RE.exec(child.value))) {
            if (m.index > last) out.push({ type: 'text', value: child.value.slice(last, m.index) });
            // Obsidian-style section link: [[term#anchor|text]] targets a
            // heading id on the term's page (anchors are the stable \{#id}s,
            // shared across locales).
            const hashAt = m[1].indexOf('#');
            const name = hashAt === -1 ? m[1] : m[1].slice(0, hashAt);
            const anchor = hashAt === -1 ? '' : m[1].slice(hashAt + 1).trim();
            const id = lookup[norm(name)];
            const entry = glossary[id];
            if (!entry) throw new Error(`[glossary] unknown term "[[${m[1]}]]" in ${path}`);
            const def = entry.def ? labelOf(entry.def) : undefined;
            // A def-only term (no page) links to its entry on the glossary page.
            let url = entry.stack
              ? `../../stack/${entry.stack}/`
              : entry.concept
                ? `../../concept/${entry.concept}/`
                : entry.article
                  ? `../../article/${entry.article}/`
                  : entry.href
                    ? entry.href
                    : def
                      ? `../../glossary/#${id}`
                      : null;
            if (!url)
              throw new Error(
                `[glossary] term "[[${m[1]}]]" needs one of stack/concept/article/href/def`,
              );
            if (anchor) {
              // A def-only target already carries its own hash — an extra
              // anchor is a mistake, so fail the build like an unknown term.
              if (!entry.stack && !entry.concept && !entry.article && !entry.href)
                throw new Error(
                  `[glossary] "[[${m[1]}]]" — a definition-only term can't take a #anchor`,
                );
              url += `#${anchor}`;
            }
            const text = m[2] ? m[2].trim() : labelOf(entry.label);
            /** @type {any} */
            const link = { type: 'link', url, children: [{ type: 'text', value: text }] };
            if (def) link.data = { hProperties: { title: def } };
            out.push(link);
            last = m.index + m[0].length;
          }
          if (last < child.value.length) out.push({ type: 'text', value: child.value.slice(last) });
        } else {
          walk(child);
          out.push(child);
        }
      }
      node.children = out;
    };
    walk(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project page. If you later attach a custom domain:
  //   - set `site` to that domain, change `base` to '/', and add public/CNAME.
  site: 'https://codecompose7.github.io',
  base: '/awesome-agent-stack',

  i18n: {
    locales: ['en', 'ko'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    mdx(),
    // i18n option emits hreflang alternates so search engines associate each
    // page with its twin in the other locale (/stack/x/ ↔ /ko/stack/x/).
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ko: 'ko' },
      },
    }),
  ],

  // Open external links in Markdown/MDX bodies in a new tab. Internal links
  // (no protocol) are left alone, so in-site navigation stays in the same tab.
  markdown: {
    remarkPlugins: [remarkHeadingIds, remarkMermaid, remarkGlossary],
    rehypePlugins: [
      rehypeSlug,
      rehypeHeadingAnchors,
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },

  // Bind the dev server to 0.0.0.0 so it's reachable from a browser on the
  // host (outside the Docker container). Without this, `astro dev` only listens
  // on the container's localhost and the host browser can't connect — the fix
  // for the "blank page / can't reach" symptom that `astro dev --host` solved.
  server: {
    host: true,
  },

  vite: {
    plugins: [tailwindcss(), localSamples()],

    // `@assets/...` is shorthand for `src/assets/...`, so in-body images can be
    // referenced without long `../../../assets/...` relative paths.
    resolve: {
      alias: {
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      },
    },

    // This project is developed inside a Docker bind-mount devcontainer
    // (linuxkit). Native inotify events are unreliable across the mount and
    // fire phantom "config changed" events at startup, which tear down Astro's
    // Vite module-runner transport (symptom: "transport invoke timed out" and
    // pages hanging for 60s). Polling-based watching avoids that.
    server: {
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
  },
});
