import type { Lang } from '../i18n/ui';

/**
 * Canonical category list. The `id` must match the `category` field used in
 * the frontmatter of entries under `src/content/stacks`. Order here is the
 * order sections render on the homepage. Labels/descriptions are per-locale.
 */
export interface Category {
  id: string;
  label: Record<Lang, string>;
  description: Record<Lang, string>;
}

export const categories: Category[] = [
  {
    id: 'frameworks',
    label: { en: 'Agent Frameworks', ko: '에이전트 프레임워크' },
    description: {
      en: 'Libraries for orchestrating reasoning loops, tools, and multi-agent flows.',
      ko: '추론 루프·도구·멀티 에이전트 흐름을 오케스트레이션하는 라이브러리.',
    },
  },
  {
    id: 'coding-agents',
    label: { en: 'Coding Agents', ko: '코딩 에이전트' },
    description: {
      en: 'Autonomous agents that read, write, and run code to complete software tasks.',
      ko: '코드를 읽고 쓰고 실행해 소프트웨어 작업을 자율적으로 수행하는 에이전트.',
    },
  },
  {
    id: 'llm-providers',
    label: { en: 'LLM Providers & Gateways', ko: 'LLM 제공자 & 게이트웨이' },
    description: {
      en: 'Foundation-model APIs — and the gateways that unify them — powering an agent’s reasoning.',
      ko: '에이전트의 추론을 담당하는 파운데이션 모델 API와 이를 하나로 묶는 게이트웨이.',
    },
  },
  {
    id: 'vector-stores',
    label: { en: 'Vector Stores & Memory', ko: '벡터 스토어 & 메모리' },
    description: {
      en: 'Embeddings storage and retrieval for long-term memory and RAG.',
      ko: '장기 기억과 RAG를 위한 임베딩 저장·검색.',
    },
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

export const categoryMap = new Map(categories.map((c) => [c.id, c]));
