// @ts-check
// Site-level config only: URL, base path, locales, and the site's glossary.
// Everything else — routes, components, markdown pipeline, tailwind, the
// dev-only local-samples middleware — comes from the stack-site-builder
// theme — https://github.com/CodeCompose7/stack-site-builder
import { defineConfig } from 'astro/config';
import aasTheme from 'stack-site-builder';
import { glossary } from './src/data/glossary.mjs';
import { site } from './src/data/site';

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

  // `sections` (declared in src/data/site.ts) turns optional sections off; the
  // theme skips their routes here and hides their nav item there, from one source.
  integrations: [aasTheme({ glossary, sections: site.sections })],
});
