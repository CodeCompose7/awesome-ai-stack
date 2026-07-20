/**
 * This site's identity, consumed by the @awesome-ai-stack/core theme via the
 * `@aas-data/site` alias. UI string overrides (taglines etc.) use the same
 * keys as `packages/core/src/i18n/ui.ts`.
 */
export const site = {
  /** Shown in the header and as the homepage title. */
  name: 'awesome-ai-image-stack',
  /** The repo that hosts this site's content — sample folder links point here. */
  repoUrl: 'https://github.com/codecompose7/awesome-ai-stack',
  /** User-Agent for build-time GitHub API calls (stars/latest release). */
  buildUserAgent: 'awesome-ai-image-stack-build',
  /** Per-locale overrides for the theme's UI strings; empty = theme defaults. */
  ui: {
    en: {
      'site.tagline':
        'A curated stack of the tools and services you actually use for AI image generation and processing — each with a detail page and runnable sample code.',
    } as Record<string, string>,
    ko: {
      'site.tagline':
        'AI 이미지 생성·처리에 실제로 쓰는 도구와 서비스를 모았습니다 — 각 항목마다 상세 페이지와 바로 실행 가능한 샘플 코드를 제공합니다.',
    } as Record<string, string>,
  },
};

export type SiteConfig = typeof site;
