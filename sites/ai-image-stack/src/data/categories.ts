import { buildTree, type Category } from '@awesome-ai-stack/core/lib/category-tree';

export type { Category } from '@awesome-ai-stack/core/lib/category-tree';

/**
 * The tool-catalog taxonomy for this site: AI image generation and processing.
 * Top-level order is the order sections render on the homepage. A stack
 * entry's `category` frontmatter must be a node id from this tree.
 */
const categories: Category[] = [
  {
    id: 'img-generation',
    label: { en: 'Image Generation', ko: '이미지 생성' },
    description: {
      en: 'Models and services that create images from text or images',
      ko: '텍스트나 이미지에서 새 이미지를 만들어 내는 모델과 서비스',
    },
    detail: {
      en: 'Text-to-image and image-to-image generation: diffusion models, hosted generation APIs, and the model families behind them.',
      ko: '텍스트→이미지, 이미지→이미지 생성 — 디퓨전 모델, 호스팅 생성 API, 그리고 그 뒤의 모델 패밀리를 다룹니다.',
    },
  },
  {
    id: 'img-pipelines',
    label: { en: 'Pipelines & UIs', ko: '파이프라인·UI' },
    description: {
      en: 'Node editors, workflow engines and UIs that orchestrate image models',
      ko: '이미지 모델을 엮어 돌리는 노드 에디터·워크플로 엔진·UI',
    },
    detail: {
      en: 'The glue layer: visual node editors and workflow runners that compose models, samplers, upscalers and post-processing into repeatable pipelines.',
      ko: '접착 계층입니다. 모델·샘플러·업스케일러·후처리를 반복 가능한 파이프라인으로 조립하는 비주얼 노드 에디터와 워크플로 러너를 다룹니다.',
    },
  },
  {
    id: 'img-processing',
    label: { en: 'Editing & Upscaling', ko: '편집·업스케일' },
    description: {
      en: 'Tools that transform existing images — restoration, upscaling, background removal',
      ko: '기존 이미지를 다듬는 도구 — 복원, 업스케일, 배경 제거',
    },
    detail: {
      en: 'Everything applied after (or instead of) generation: super-resolution, restoration, matting/background removal, and classic vision transforms.',
      ko: '생성 이후에(또는 생성 대신) 적용하는 것들 — 초해상도, 복원, 매팅·배경 제거, 고전적인 비전 변환을 다룹니다.',
    },
  },
];

/** Top-level categories (homepage sections), in display order. */
export const rootCategories = categories;

const tree = buildTree(categories);

/** Every node by id (top-level and nested). */
export const categoryMap = tree.map;

/** All category ids, for static path generation. */
export const allCategoryIds = tree.allIds;

/** Root → node chain for an id (its breadcrumb path). Empty if unknown. */
export const pathOf = tree.pathOf;

/** Direct children of a node (empty for leaves). */
export const childrenOf = tree.childrenOf;

/** A node's id plus all of its descendants' ids (for subtree roll-up). */
export const descendantIds = tree.descendantIds;

/** The top-level ancestor id of a node (itself if already top-level). */
export function rootIdOf(id: string): string {
  const path = pathOf(id);
  return path.length ? path[0].id : id;
}
