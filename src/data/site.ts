/**
 * This site's identity, consumed by the stack-site-builder theme via the
 * `@aas-data/site` alias: header/home name, the GitHub repo behind "view
 * source" links and sample folder URLs, and the User-Agent for build-time
 * GitHub API calls. UI strings (taglines etc.) can be overridden per-site via
 * `ui` — keys match the theme's src/i18n/ui.ts.
 */
export const site = {
  /** Shown in the header and as the homepage title. */
  name: 'awesome-ai-stack',
  /** The repo that hosts this site's content — sample folder links point here. */
  repoUrl: 'https://github.com/codecompose7/awesome-ai-stack',
  /** User-Agent for build-time GitHub API calls (stars/latest release). */
  buildUserAgent: 'awesome-ai-stack-build',
  /** Per-locale overrides for the theme's UI strings; empty = theme defaults. */
  ui: {
    en: {} as Record<string, string>,
    ko: {} as Record<string, string>,
  },
};

export type SiteConfig = typeof site;
