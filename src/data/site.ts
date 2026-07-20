import type { LocaleDef } from 'stack-site-builder/i18n/ui';

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
  /**
   * The locales this site ships, declared here rather than left to the theme's
   * built-in en/ko default — the first entry is the default locale and must
   * match astro.config's `i18n.defaultLocale` (its routing `locales` list is
   * the twin of this one). Each is `{ code, label, dateLocale? }`: `label`
   * names the language in the switcher, `dateLocale` is the BCP-47 tag used to
   * format dates. To add a language, add an entry here, list its `code` in
   * astro.config `i18n.locales`, and supply its content + `ui.<code>` strings.
   */
  locales: [
    { code: 'en', label: 'English', dateLocale: 'en-US' },
    { code: 'ko', label: '한국어', dateLocale: 'ko-KR' },
  ] satisfies LocaleDef[],
  /** Per-locale overrides for the theme's UI strings; empty = theme defaults. */
  ui: {
    en: {} as Record<string, string>,
    ko: {} as Record<string, string>,
  },
};

export type SiteConfig = typeof site;
