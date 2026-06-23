// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';

// Prepend a "#" copy-link anchor to h2/h3 headings only (a global click handler
// in BaseLayout copies the section URL). Runs after rehype-slug adds the ids.
function rehypeHeadingAnchors() {
  /** @param {any} node */
  const walk = (node) => {
    if (!node.children) return;
    for (const child of node.children) {
      if (
        child.type === 'element' &&
        (child.tagName === 'h2' || child.tagName === 'h3') &&
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

  integrations: [mdx(), sitemap()],

  // Open external links in Markdown/MDX bodies in a new tab. Internal links
  // (no protocol) are left alone, so in-site navigation stays in the same tab.
  markdown: {
    remarkPlugins: [remarkMermaid],
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
    plugins: [tailwindcss()],

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
