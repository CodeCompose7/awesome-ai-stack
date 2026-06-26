import type { Lang } from '../i18n/ui';

/**
 * Canonical category tree. A category may have `children` (subcategories),
 * nestable to any depth. A stack's `category` frontmatter field points to the
 * most specific node it belongs to — a top-level category, or any subcategory.
 *
 * `id` must be globally unique across the whole tree (it keys the URL at
 * `/categories/<id>/` and the `category` field in `src/content/stacks`).
 * Top-level order here is the order sections render on the homepage.
 */
export interface Category {
  id: string;
  label: Record<Lang, string>;
  description: Record<Lang, string>;
  children?: Category[];
}

export const categories: Category[] = [
  {
    id: 'frameworks',
    label: { en: 'Agent Frameworks', ko: '에이전트 프레임워크' },
    description: {
      en: 'Libraries for orchestrating reasoning loops, tools, and multi-agent flows.',
      ko: '추론 루프·도구·멀티 에이전트 흐름을 오케스트레이션하는 라이브러리.',
    },
    children: [
      {
        id: 'framework-orchestration',
        label: { en: 'Multi-Agent Orchestration', ko: '멀티 에이전트 오케스트레이션' },
        description: {
          en: 'Coordinate multiple agents, tools, and reasoning steps into one workflow.',
          ko: '여러 에이전트·도구·추론 단계를 하나의 워크플로로 조율하는 도구.',
        },
      },
      {
        id: 'framework-structured',
        label: { en: 'Structured Output & Typing', ko: '구조화 출력 & 타입' },
        description: {
          en: 'Coerce model responses into validated, typed data structures.',
          ko: '모델 응답을 검증된 타입 데이터 구조로 변환하는 도구.',
        },
      },
      {
        id: 'framework-prompt',
        label: { en: 'Prompt Optimization', ko: '프롬프트 최적화' },
        description: {
          en: 'Program and automatically optimize prompts instead of hand-tuning them.',
          ko: '프롬프트를 직접 튜닝하는 대신 프로그래밍하고 자동으로 최적화하는 도구.',
        },
      },
    ],
  },
  {
    id: 'coding-agents',
    label: { en: 'Coding Agents', ko: '코딩 에이전트' },
    description: {
      en: 'Autonomous agents that read, write, and run code to complete software tasks.',
      ko: '코드를 읽고 쓰고 실행해 소프트웨어 작업을 자율적으로 수행하는 에이전트.',
    },
    children: [
      {
        id: 'coding-cli',
        label: { en: 'Terminal & CLI', ko: '터미널 & CLI' },
        description: {
          en: 'Coding agents you drive from the command line.',
          ko: '커맨드라인에서 다루는 코딩 에이전트.',
        },
      },
      {
        id: 'coding-ide',
        label: { en: 'IDE-Integrated', ko: 'IDE 통합' },
        description: {
          en: 'Agents that live inside your editor.',
          ko: '에디터 안에서 동작하는 에이전트.',
        },
      },
      {
        id: 'coding-autonomous',
        label: { en: 'Autonomous SWE', ko: '자율 SWE 에이전트' },
        description: {
          en: 'Agents that resolve issues and tasks end to end.',
          ko: '이슈와 작업을 끝까지 자율적으로 해결하는 에이전트.',
        },
      },
    ],
  },
  {
    id: 'llm-providers',
    label: { en: 'LLM Providers & Gateways', ko: 'LLM 제공자 & 게이트웨이' },
    description: {
      en: 'Foundation-model APIs — and the gateways that unify them — powering an agent’s reasoning.',
      ko: '에이전트의 추론을 담당하는 파운데이션 모델 API와 이를 하나로 묶는 게이트웨이.',
    },
    children: [
      {
        id: 'llm-foundation',
        label: { en: 'Foundation Model APIs', ko: '파운데이션 모델 API' },
        description: {
          en: 'First-party APIs for frontier models.',
          ko: '프런티어 모델의 1차 제공자 API.',
        },
      },
      {
        id: 'llm-gateway',
        label: { en: 'Gateways & Routers', ko: '게이트웨이 & 라우터' },
        description: {
          en: 'One interface that unifies many providers.',
          ko: '여러 제공자를 하나의 인터페이스로 통합하는 도구.',
        },
      },
      {
        id: 'llm-local',
        label: { en: 'Local Models', ko: '로컬 모델' },
        description: {
          en: 'Run open models on your own hardware.',
          ko: '오픈 모델을 직접 실행하는 도구.',
        },
      },
    ],
  },
  {
    id: 'vector-stores',
    label: { en: 'Vector Stores & Memory', ko: '벡터 스토어 & 메모리' },
    description: {
      en: 'Embeddings storage and retrieval for long-term memory and RAG.',
      ko: '장기 기억과 RAG를 위한 임베딩 저장·검색.',
    },
    children: [
      {
        id: 'vec-db',
        label: { en: 'Vector Databases', ko: '벡터 데이터베이스' },
        description: {
          en: 'Stores for embeddings and similarity search.',
          ko: '임베딩 저장과 유사도 검색을 위한 데이터베이스.',
        },
      },
      {
        id: 'vec-memory',
        label: { en: 'Agent Memory', ko: '에이전트 메모리' },
        description: {
          en: 'Long-term memory layers for agents.',
          ko: '에이전트를 위한 장기 기억 계층.',
        },
      },
      {
        id: 'vec-embeddings',
        label: { en: 'Embedding Models', ko: '임베딩 모델' },
        description: {
          en: 'Models that turn text into vectors.',
          ko: '텍스트를 벡터로 변환하는 모델.',
        },
      },
    ],
  },
  {
    id: 'observability',
    label: { en: 'Observability & Eval', ko: '관측성 & 평가' },
    description: {
      en: 'Tracing, evaluation, and monitoring for agent runs.',
      ko: '에이전트 실행에 대한 트레이싱·평가·모니터링.',
    },
  },
];

/** Top-level categories (homepage sections), in display order. */
export const rootCategories = categories;

/** Every node by id (top-level and nested), and each node's parent id. */
export const categoryMap = new Map<string, Category>();
const parentOf = new Map<string, string | null>();
(function index(nodes: Category[], parent: string | null) {
  for (const c of nodes) {
    categoryMap.set(c.id, c);
    parentOf.set(c.id, parent);
    if (c.children) index(c.children, c.id);
  }
})(categories, null);

/** All category ids, for static path generation. */
export const allCategoryIds = [...categoryMap.keys()];

/** Root → node chain for an id (its breadcrumb path). Empty if unknown. */
export function pathOf(id: string): Category[] {
  const out: Category[] = [];
  let cur: string | null = id;
  while (cur) {
    const c = categoryMap.get(cur);
    if (!c) break;
    out.unshift(c);
    cur = parentOf.get(cur) ?? null;
  }
  return out;
}

/** The top-level ancestor id of a node (itself if already top-level). */
export function rootIdOf(id: string): string {
  const path = pathOf(id);
  return path.length ? path[0].id : id;
}

/** A node's id plus all of its descendants' ids (for subtree roll-up). */
export function descendantIds(id: string): string[] {
  const node = categoryMap.get(id);
  if (!node) return [id];
  const out = [id];
  for (const child of node.children ?? []) out.push(...descendantIds(child.id));
  return out;
}

/** Direct children of a node (empty for leaves). */
export function childrenOf(id: string): Category[] {
  return categoryMap.get(id)?.children ?? [];
}
