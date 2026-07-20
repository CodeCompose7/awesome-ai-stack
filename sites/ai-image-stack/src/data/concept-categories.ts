import { buildTree, type Category } from '@awesome-ai-stack/core/lib/category-tree';

/**
 * Taxonomy for the `concepts` collection — separate from the tool categories.
 * A concept's `category` frontmatter points to a leaf id here.
 */
export const conceptCategories: Category[] = [
  {
    id: 'concept-image-pipelines',
    label: { en: 'Image Pipelines', ko: '이미지 파이프라인' },
    description: {
      en: 'How generation, editing and upscaling steps compose into a workflow',
      ko: '생성·편집·업스케일 단계가 어떻게 하나의 워크플로로 엮이는가',
    },
  },
  {
    id: 'concept-uncategorized',
    label: { en: 'Uncategorized', ko: '미분류' },
    description: {
      en: 'Concepts not yet sorted into a category',
      ko: '아직 분류에 들어가지 않은 개념',
    },
  },
];

export const conceptTree = buildTree(conceptCategories);

/** Id of the fallback category that holds concepts without a real category. */
export const UNCATEGORIZED_CONCEPT = 'concept-uncategorized';

/**
 * Resolve a concept's frontmatter `category` to a real tree id, mapping a
 * missing or unknown value to the uncategorized bucket.
 */
export const conceptCatOf = (category?: string | null): string =>
  category && conceptTree.map.has(category) ? category : UNCATEGORIZED_CONCEPT;
