import { buildTree, type Category } from '@awesome-ai-stack/core/lib/category-tree';

/**
 * Taxonomy for the `articles` collection — separate from the tool categories.
 * An article's `category` frontmatter points to a leaf id here.
 */
export const articleCategories: Category[] = [
  {
    id: 'article-tutorials',
    label: { en: 'Tutorials', ko: '튜토리얼' },
    description: {
      en: 'Step-by-step walkthroughs of image workflows',
      ko: '이미지 워크플로를 단계별로 따라가는 글',
    },
  },
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
 * missing or unknown value to the uncategorized bucket.
 */
export const articleCatOf = (category?: string | null): string =>
  category && articleTree.map.has(category) ? category : UNCATEGORIZED_ARTICLE;
