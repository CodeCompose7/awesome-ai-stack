// @ts-check
// Site-level config only — routes, components, markdown pipeline and styling
// all come from the @awesome-ai-stack/core theme. See packages/core/index.mjs.
import { defineConfig } from 'astro/config';
import aasTheme from '@awesome-ai-stack/core';
import { glossary } from './src/data/glossary.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://codecompose7.github.io',
  base: '/awesome-ai-image-stack',

  i18n: {
    locales: ['en', 'ko'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [aasTheme({ glossary })],
});
