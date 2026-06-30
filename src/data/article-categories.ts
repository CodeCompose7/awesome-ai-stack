import { buildTree, type Category } from './category-tree';

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
];

export const articleTree = buildTree(articleCategories);
