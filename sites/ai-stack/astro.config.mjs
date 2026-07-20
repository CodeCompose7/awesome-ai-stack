// @ts-check
// Site-level config only: URL, base path, locales, and the site's glossary.
// Everything else — routes, components, markdown pipeline, tailwind, the
// dev-only local-samples middleware — comes from the @awesome-ai-stack/core
// theme. See packages/core/index.mjs.
import { defineConfig } from 'astro/config';
import aasTheme from '@awesome-ai-stack/core';
import { glossary } from './src/data/glossary.mjs';

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

  integrations: [aasTheme({ glossary })],
});
