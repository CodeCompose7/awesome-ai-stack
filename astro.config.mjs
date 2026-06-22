// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

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
