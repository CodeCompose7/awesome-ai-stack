import type { LocaleDef } from 'stack-site-builder/i18n/ui';
import type { SectionKey } from 'stack-site-builder';

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
  repoUrl: 'https://github.com/CodeComposeStudio/awesome-ai-stack',
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
  /**
   * Optional sections to turn off (all on by default). The core catalog (home,
   * tool detail, categories, tags, vendors) is always on; concepts, articles,
   * samples, slides, glossary and the standalone `pages` collection are opt-out.
   * This hides the section's header-nav item; astro.config forwards the same
   * object to `aasTheme({ sections })` to also skip its routes — keep the two
   * in sync (astro.config reads `site.sections`, so they can't drift).
   *
   * `pages` is off: this site has no standalone pages section (no About/소개).
   */
  sections: { pages: false } satisfies Partial<Record<SectionKey, boolean>>,
  /** Per-locale overrides for the theme's UI strings; empty = theme defaults. */
  ui: {
    en: {} as Record<string, string>,
    ko: {} as Record<string, string>,
  },
};

export type SiteConfig = typeof site;
