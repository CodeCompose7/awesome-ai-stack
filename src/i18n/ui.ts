/**
 * Central place for everything language-related.
 *
 * Locale routing (configured in astro.config.mjs): `en` is the default and is
 * served at the root, `ko` is served under `/ko/`. Tool content lives in
 * `src/content/stacks/<lang>/`. Use `astro:i18n`'s `getRelativeLocaleUrl` to
 * build locale-aware links so the base path and `/ko` prefix are handled for us.
 */

export const languages = {
  en: 'English',
  ko: '한국어',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

export function isLang(value: string): value is Lang {
  return value in languages;
}

/** UI chrome strings, keyed by a dotted id. */
export const ui = {
  en: {
    'site.tagline':
      'A curated stack of the tools and services you actually use to build AI agents — each with a detail page and runnable sample code.',
    'nav.browse': 'Browse',
    'nav.blog': 'Writing',
    'detail.allTools': 'All tools',
    'detail.website': 'Website',
    'detail.repository': 'Repository',
    'detail.docs': 'Docs',
    'detail.language': 'Language',
    'detail.license': 'License',
    'detail.pricing': 'Pricing',
    'detail.relatedWriting': 'Related writing',
    'blog.title': 'Writing',
    'blog.tagline': 'Notes and comparisons on building AI agents, linked to the tools they discuss.',
    'blog.empty': 'No posts yet.',
    'article.backToBlog': 'All writing',
    'article.referencedTools': 'Tools in this article',
    'theme.label': 'Theme',
    'theme.system': 'System',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'tab.overview': 'Overview',
    'tab.code': 'Code samples',
    'sample.version': 'Version',
    'sample.diagram': 'Structure',
    'footer.builtWith': 'Built with',
    'footer.contribute': 'Contributions welcome — add a tool by dropping an MDX file.',
  },
  ko: {
    'site.tagline':
      'AI 에이전트를 만들 때 실제로 쓰는 도구와 서비스를 모았습니다 — 각 항목마다 상세 페이지와 바로 실행 가능한 샘플 코드를 제공합니다.',
    'nav.browse': '둘러보기',
    'nav.blog': '글',
    'detail.allTools': '전체 도구',
    'detail.website': '웹사이트',
    'detail.repository': '저장소',
    'detail.docs': '문서',
    'detail.language': '언어',
    'detail.license': '라이선스',
    'detail.pricing': '가격',
    'detail.relatedWriting': '관련 글',
    'blog.title': '글',
    'blog.tagline': 'AI 에이전트 구축에 관한 노트와 비교 — 다루는 도구로 바로 연결됩니다.',
    'blog.empty': '아직 글이 없습니다.',
    'article.backToBlog': '전체 글',
    'article.referencedTools': '이 글에서 다루는 도구',
    'theme.label': '테마',
    'theme.system': '시스템',
    'theme.light': '라이트',
    'theme.dark': '다크',
    'tab.overview': '설명',
    'tab.code': '코드 샘플',
    'sample.version': '버전',
    'sample.diagram': '구조',
    'footer.builtWith': '제작 도구:',
    'footer.contribute': '기여를 환영합니다 — MDX 파일 하나만 추가하면 도구가 등록됩니다.',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];

/** Returns a `t(key)` translator bound to the given language. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Human labels for the `pricing` frontmatter enum, per locale. */
export const pricingLabels: Record<Lang, Record<string, string>> = {
  en: {
    'open-source': 'open source',
    'free-tier': 'free tier',
    paid: 'paid',
    free: 'free',
  },
  ko: {
    'open-source': '오픈소스',
    'free-tier': '무료 티어',
    paid: '유료',
    free: '무료',
  },
};
