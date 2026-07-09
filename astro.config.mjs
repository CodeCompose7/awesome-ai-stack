// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import { glossary } from './src/data/glossary.mjs';
import { localSamples } from './dev/local-samples.mjs';

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
    // Same-document section links ([[#anchor]]) resolve their display text to
    // the target heading's own title. Collect id -> title up front from this
    // file's tree. remarkHeadingIds ran earlier, so explicit \{#id} headings
    // already carry their id on data.hProperties and have the \{#id} stripped
    // from the visible text. Auto-slugged headings (no explicit id) have no id
    // at this stage and are intentionally not indexed — an unknown anchor fails
    // the build, nudging authors to add an explicit \{#id}.
    /** @param {any} node @returns {string} */
    const headingText = (node) =>
      (node.children || []).map((c) => (c.value != null ? c.value : headingText(c))).join('');
    /** @type {Record<string, string>} */
    const headingTitles = {};
    /** @param {any} node */
    const collectHeadings = (node) => {
      if (!node.children) return;
      for (const c of node.children) {
        if (c.type === 'heading') {
          const hid = c.data && c.data.hProperties && c.data.hProperties.id;
          if (hid) headingTitles[hid] = headingText(c);
        } else collectHeadings(c);
      }
    };
    collectHeadings(tree);
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
            // Same-document section link: [[#anchor]] / [[#anchor|text]] points
            // at a heading in THIS file (no glossary term before the #). The
            // display text defaults to the heading's own title.
            if (name === '') {
              if (!anchor) throw new Error(`[glossary] empty wikilink "[[${m[1]}]]" in ${path}`);
              const title = headingTitles[anchor];
              if (!title)
                throw new Error(
                  `[glossary] "[[${m[1]}]]" — no heading with an explicit \{#${anchor}} in ${path}`,
                );
              const text = m[2] ? m[2].trim() : title;
              out.push({ type: 'link', url: `#${anchor}`, children: [{ type: 'text', value: text }] });
              last = m.index + m[0].length;
              continue;
            }
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
  base: '/awesome-ai-stack',

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
