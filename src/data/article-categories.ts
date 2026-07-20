import { buildTree, type Category } from 'stack-site-builder/lib/category-tree';

/**
 * Taxonomy for the `articles` collection — separate from the tool categories.
 * An article's `category` frontmatter points to a leaf id here. Top-level order
 * is the order sections render on the writing index.
 */
export const articleCategories: Category[] = [
  {
    id: 'article-tutorials',
    label: { en: 'Tutorials', ko: '튜토리얼' },
    description: {
      en: 'Build something runnable, step by step',
      ko: '실제로 돌아가는 것을 단계별로 만들어 보기',
    },
    children: [
      {
        id: 'article-build-agents',
        label: { en: 'Building Agents', ko: '에이전트 만들기' },
        description: {
          en: 'Wire a model, tools, and a loop into a working agent',
          ko: '모델·도구·루프를 엮어 동작하는 에이전트로',
        },
      },
    ],
  },
  {
    id: 'article-comparisons',
    label: { en: 'Comparisons', ko: '비교' },
    description: {
      en: 'Weigh similar tools and how to choose between them',
      ko: '비슷한 도구를 견주고 무엇을 고를지 정리',
    },
  },
  // Fallback bucket for articles with no (or an unknown) `category`. Kept last
  // so it renders after the curated categories. See `articleCatOf`.
  {
    id: 'article-uncategorized',
    label: { en: 'Uncategorized', ko: '미분류' },
    description: {
      en: 'Writing not yet sorted into a category',
      ko: '아직 분류에 들어가지 않은 글',
    },
  },
];

export const articleTree = buildTree(articleCategories);

/** Id of the fallback category that holds articles without a real category. */
export const UNCATEGORIZED_ARTICLE = 'article-uncategorized';

/**
 * Resolve an article's frontmatter `category` to a real tree id, mapping a
 * missing or unknown value to the uncategorized bucket. Use this everywhere an
 * article is placed into the taxonomy (index sections, category pages,
 * breadcrumbs) so nothing silently disappears.
 */
export const articleCatOf = (category?: string | null): string =>
  category && articleTree.map.has(category) ? category : UNCATEGORIZED_ARTICLE;
