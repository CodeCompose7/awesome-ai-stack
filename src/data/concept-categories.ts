import { buildTree, type Category } from './category-tree';

/**
 * Taxonomy for the `concepts` collection — separate from the tool categories.
 * A concept's `category` frontmatter points to a leaf id here. Top-level order
 * is the order sections render on the concept index.
 */
export const conceptCategories: Category[] = [
  {
    id: 'concept-agent-systems',
    label: { en: 'Agent Systems', ko: '에이전트 시스템' },
    description: {
      en: 'How the pieces of an agent fit together and stay reliable',
      ko: '에이전트의 조각들이 어떻게 맞물려 안정적으로 동작하는가',
    },
    children: [
      {
        id: 'concept-architecture',
        label: { en: 'Architecture', ko: '아키텍처' },
        description: {
          en: 'The scaffolding around a model that makes it dependable',
          ko: '모델을 믿을 수 있게 만드는 둘레의 스캐폴딩',
        },
      },
      {
        id: 'concept-tooling',
        label: { en: 'Tools & Capabilities', ko: '도구·능력' },
        description: {
          en: 'What an agent can actually reach for and do',
          ko: '에이전트가 실제로 손에 쥐고 할 수 있는 일',
        },
      },
    ],
  },
];

export const conceptTree = buildTree(conceptCategories);
