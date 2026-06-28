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
    'nav.concepts': 'Concepts',
    'nav.blog': 'Writing',
    'search.placeholder': 'Search tools…',
    'concept.title': 'Concepts',
    'concept.tagline': 'Patterns that compose catalog tools into a working agent stack.',
    'concept.empty': 'No concepts yet.',
    'concept.usedTools': 'Tools it uses',
    'concept.relatedConcepts': 'Related concepts',
    'concept.backToConcepts': 'All concepts',
    'concept.updated': 'Updated',
    'detail.usedInConcepts': 'Used in concepts',
    'sort.label': 'Sort',
    'sort.alpha': 'A–Z',
    'sort.recent': 'Recently updated',
    'sort.stars': 'Stars',
    'filter.clear': 'Clear',
    'view.label': 'View',
    'view.standard': 'Standard',
    'view.gallery': 'Gallery',
    'filter.updated': 'Last updated',
    'updated.all': 'Show all',
    'updated.6m': 'Within 6 months',
    'updated.1y': 'Within 1 year',
    'updated.2y': 'Within 2 years',
    'results.none': 'No tools match.',
    'detail.allTools': 'All tools',
    'detail.website': 'Website',
    'detail.repository': 'Repository',
    'detail.docs': 'Docs',
    'detail.language': 'Language',
    'detail.license': 'License',
    'detail.pricing': 'Pricing',
    'detail.source': 'Source',
    'detail.asOf': 'as of',
    'detail.plan': 'Plan',
    'detail.price': 'Price',
    'detail.notes': 'Notes',
    'pricing.stale': 'Prices not checked in 1+ year',
    'pricing.staleHint': 'Pricing was last verified more than a year ago — may be out of date',
    'pricing.aging': 'Prices not checked in 6+ months',
    'pricing.agingHint': 'Pricing was last verified more than six months ago — may be out of date',
    'detail.relatedWriting': 'Related writing',
    'detail.relatedTools': 'Related tools',
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
    'tab.pricing': 'Pricing',
    'tab.code': 'Code samples',
    'tab.impl': 'Implementation',
    'project.intro': 'A real, runnable mini-project. Download it and run with Docker.',
    'project.viewOnGitHub': 'View folder on GitHub',
    'project.example': 'Example',
    'project.files': 'Files',
    'project.relatedTools': 'Related tools',
    'project.unregistered': 'Not in our catalog',
    'project.readmeExpand': 'Show README',
    'project.readmeCollapse': 'Hide README',
    'sample.example': 'Example',
    'sample.diagram': 'Structure',
    'tag.heading': 'Tag',
    'tag.allTools': 'All tools',
    'detail.vendor': 'Vendor',
    'vendor.heading': 'By',
    'toc.onThisPage': 'On this page',
    'toc.versions': 'Versions',
    'meta.released': 'Last release',
    'meta.updated': 'Updated',
    'meta.docVersion': 'Doc version',
    'collapse.more': '+{n} more',
    'collapse.less': 'Show less',
    'meta.deprecated': 'Maintenance only',
    'meta.stale': 'No updates in 1+ year',
    'meta.staleHint': 'The latest release is more than a year old',
    'meta.formerly': 'Formerly',
    'meta.aging': 'No updates in 6+ months',
    'meta.agingHint': 'The latest release is more than six months old',
    'top.label': 'Back to top',
    'footer.builtWith': 'Built with',
    'footer.contribute': 'Contributions welcome — add a tool by dropping an MDX file.',
  },
  ko: {
    'site.tagline':
      'AI 에이전트를 만들 때 실제로 쓰는 도구와 서비스를 모았습니다 — 각 항목마다 상세 페이지와 바로 실행 가능한 샘플 코드를 제공합니다.',
    'nav.browse': '둘러보기',
    'nav.concepts': '개념',
    'nav.blog': '글',
    'search.placeholder': '도구 검색…',
    'concept.title': '개념',
    'concept.tagline': '카탈로그의 도구를 엮어 동작하는 에이전트 스택을 구성하는 패턴.',
    'concept.empty': '아직 개념이 없습니다.',
    'concept.usedTools': '쓰는 도구',
    'concept.relatedConcepts': '관련 개념',
    'concept.backToConcepts': '개념 전체',
    'concept.updated': '업데이트',
    'detail.usedInConcepts': '이 도구가 쓰이는 개념',
    'sort.label': '정렬',
    'sort.alpha': '이름순',
    'sort.recent': '최근 업데이트순',
    'sort.stars': 'Star순',
    'filter.clear': '초기화',
    'view.label': '보기',
    'view.standard': '표준',
    'view.gallery': '갤러리',
    'filter.updated': '최신 업데이트',
    'updated.all': '전체보기',
    'updated.6m': '최근 6개월 이내',
    'updated.1y': '최근 1년 이내',
    'updated.2y': '최근 2년 이내',
    'results.none': '조건에 맞는 도구가 없습니다.',
    'detail.allTools': '전체 도구',
    'detail.website': '웹사이트',
    'detail.repository': '저장소',
    'detail.docs': '문서',
    'detail.language': '언어',
    'detail.license': '라이선스',
    'detail.pricing': '가격',
    'detail.source': '출처',
    'detail.asOf': '기준일',
    'detail.plan': '플랜',
    'detail.price': '가격',
    'detail.notes': '비고',
    'pricing.stale': '가격 1년 이상 미확인',
    'pricing.staleHint': '가격을 마지막으로 확인한 지 1년이 지나, 현재가와 다를 수 있습니다',
    'pricing.aging': '가격 6개월 이상 미확인',
    'pricing.agingHint': '가격을 마지막으로 확인한 지 6개월이 지나, 현재가와 다를 수 있습니다',
    'detail.relatedWriting': '관련 글',
    'detail.relatedTools': '관련 도구',
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
    'tab.pricing': '가격',
    'tab.code': '코드 샘플',
    'tab.impl': '구현 샘플',
    'project.intro': '실제로 실행 가능한 미니 프로젝트입니다. 받아서 Docker로 실행해 보세요.',
    'project.viewOnGitHub': 'GitHub에서 폴더 보기',
    'project.example': '예제',
    'project.files': '파일',
    'project.relatedTools': '관련 도구',
    'project.unregistered': '목록에 없는 도구',
    'project.readmeExpand': '본문 펼치기',
    'project.readmeCollapse': '본문 접기',
    'sample.example': '예제',
    'sample.diagram': '구조',
    'tag.heading': '태그',
    'tag.allTools': '전체 도구',
    'detail.vendor': '만든 곳',
    'vendor.heading': '만든 곳',
    'toc.onThisPage': '목차',
    'toc.versions': '버전',
    'meta.released': '최신 릴리스',
    'meta.updated': '업데이트',
    'meta.docVersion': '문서버전',
    'collapse.more': '+{n}개 더 보기',
    'collapse.less': '접기',
    'meta.deprecated': '유지보수 전용',
    'meta.stale': '1년 이상 업데이트 없음',
    'meta.staleHint': '최신 릴리스가 1년 이상 지났습니다',
    'meta.formerly': '이전',
    'meta.aging': '6개월 이상 업데이트 없음',
    'meta.agingHint': '최신 릴리스가 6개월 이상 지났습니다',
    'top.label': '맨 위로',
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
    'completely-free': 'Completely free',
    'open-source': 'Open source',
    'free-tier': 'Free tier',
    paid: 'Paid',
    free: 'Free',
  },
  ko: {
    'completely-free': '완전 무료',
    'open-source': '오픈소스',
    'free-tier': '무료 티어',
    paid: '유료',
    free: '무료',
  },
};

/** Descriptive (non-name) licenses get localized; real license names pass through. */
const licenseLabels: Record<Lang, Record<string, string>> = {
  en: { proprietary: 'Proprietary' },
  ko: { proprietary: '독점' },
};
export function licenseLabel(lang: Lang, value: string): string {
  return licenseLabels[lang][value] ?? value;
}
