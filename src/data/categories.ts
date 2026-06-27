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
  /** Short one-liner used on cards, homepage sections, and subcategory summaries. */
  description: Record<Lang, string>;
  /** Longer explanation shown on the category's own page (falls back to `description`). */
  detail?: Record<Lang, string>;
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
    detail: {
      en: 'The backbone of an agent: these libraries run the reason–act loop, call tools, manage state, and coordinate one or many agents. Pick based on how much structure you want — from a single typed call to a full multi-agent graph.',
      ko: '에이전트의 중심축입니다. 추론–행동 루프를 돌리고 도구를 호출하며 상태를 관리하고, 하나 또는 여러 에이전트를 조율하는 라이브러리입니다. 단순한 타입 호출부터 본격적인 멀티 에이전트 그래프까지, 필요한 구조화 수준에 따라 고르세요.',
    },
    children: [
      {
        id: 'framework-orchestration',
        label: { en: 'Multi-Agent Orchestration', ko: '멀티 에이전트 오케스트레이션' },
        description: {
          en: 'Coordinate multiple agents, tools, and reasoning steps into one workflow.',
          ko: '여러 에이전트·도구·추론 단계를 하나의 워크플로로 조율하는 도구.',
        },
        detail: {
          en: 'For workflows where multiple agents or tools hand off to one another. These frameworks model the control flow — graphs, roles, or crews — and manage the shared state that flows across steps.',
          ko: '여러 에이전트나 도구가 서로 작업을 넘기는 워크플로를 위한 것입니다. 그래프·역할·크루 형태로 제어 흐름을 모델링하고 단계 사이를 흐르는 공유 상태를 관리합니다.',
        },
      },
      {
        id: 'framework-structured',
        label: { en: 'Structured Output & Typing', ko: '구조화 출력 & 타입' },
        description: {
          en: 'Coerce model responses into validated, typed data structures.',
          ko: '모델 응답을 검증된 타입 데이터 구조로 변환하는 도구.',
        },
        detail: {
          en: 'For when you need the model to return data, not prose. These libraries enforce a schema and hand you validated, typed objects — so an LLM call slots straight into typed code.',
          ko: '모델이 산문이 아니라 데이터를 반환해야 할 때 쓰입니다. 스키마를 강제해 검증된 타입 객체를 돌려주므로, LLM 호출을 타입이 있는 코드에 곧바로 끼워 넣을 수 있습니다.',
        },
      },
      {
        id: 'framework-prompt',
        label: { en: 'Prompt Optimization', ko: '프롬프트 최적화' },
        description: {
          en: 'Program and automatically optimize prompts instead of hand-tuning them.',
          ko: '프롬프트를 직접 튜닝하는 대신 프로그래밍하고 자동으로 최적화하는 도구.',
        },
        detail: {
          en: 'Treat prompting as programming. Instead of hand-tuning strings, you declare modules and let the framework compile and optimize the prompts against your metrics.',
          ko: '프롬프팅을 프로그래밍처럼 다룹니다. 문자열을 손으로 튜닝하는 대신 모듈을 선언하면, 프레임워크가 지표에 맞춰 프롬프트를 컴파일하고 최적화합니다.',
        },
      },
      {
        id: 'framework-rag',
        label: { en: 'RAG & Data Frameworks', ko: 'RAG·데이터 프레임워크' },
        description: {
          en: 'Frameworks for retrieval-augmented generation and data-centric agents.',
          ko: '검색 증강 생성(RAG)과 데이터 중심 에이전트를 위한 프레임워크.',
        },
        detail: {
          en: 'For retrieval-heavy apps — ingest, index, and query your data, then ground the model in it. The backbone of RAG pipelines and data agents.',
          ko: '검색 중심 앱을 위한 것 — 데이터를 수집·색인·질의한 뒤 모델을 그 데이터에 근거하게 한다. RAG 파이프라인과 데이터 에이전트의 중심.',
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
    detail: {
      en: 'Agents specialized for software work — they read a repo, plan a change, edit files, run tests, and iterate. They differ mainly in where you drive them: a terminal, your editor, or fully autonomous issue resolution.',
      ko: '소프트웨어 작업에 특화된 에이전트입니다. 저장소를 읽고 변경을 계획하고 파일을 수정하며 테스트를 돌리고 반복합니다. 가장 큰 차이는 어디서 다루느냐입니다 — 터미널, 에디터, 또는 완전 자율적인 이슈 해결.',
    },
    children: [
      {
        id: 'coding-cli',
        label: { en: 'Terminal & CLI', ko: '터미널 & CLI' },
        description: {
          en: 'Coding agents you drive from the command line.',
          ko: '커맨드라인에서 다루는 코딩 에이전트.',
        },
        detail: {
          en: 'Coding agents that live in your shell. You stay in the terminal, point them at files or a task, and review diffs — lightweight and easy to script.',
          ko: '셸 안에서 동작하는 코딩 에이전트입니다. 터미널에 머문 채 파일이나 작업을 지정하고 diff를 검토합니다 — 가볍고 스크립트로 다루기 좋습니다.',
        },
      },
      {
        id: 'coding-ide',
        label: { en: 'IDE-Integrated', ko: 'IDE 통합' },
        description: {
          en: 'Agents that live inside your editor.',
          ko: '에디터 안에서 동작하는 에이전트.',
        },
        detail: {
          en: 'Agents that work inside your editor, with the open file, project context, and inline diffs right where you code.',
          ko: '에디터 안에서 동작하는 에이전트입니다. 열린 파일과 프로젝트 컨텍스트, 인라인 diff를 코딩하는 자리에서 바로 다룹니다.',
        },
      },
      {
        id: 'coding-autonomous',
        label: { en: 'Autonomous SWE', ko: '자율 SWE 에이전트' },
        description: {
          en: 'Agents that resolve issues and tasks end to end.',
          ko: '이슈와 작업을 끝까지 자율적으로 해결하는 에이전트.',
        },
        detail: {
          en: 'Give them an issue and step back. These agents plan and carry out an end-to-end fix — exploring the repo, editing, and validating — and are benchmarked on suites like SWE-bench.',
          ko: '이슈를 주면 한 발 물러서면 됩니다. 저장소 탐색·수정·검증까지 처음부터 끝까지 자율적으로 수행하며, SWE-bench 같은 벤치마크로 평가됩니다.',
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
    detail: {
      en: "Where an agent's reasoning actually happens. This covers first-party model APIs, the gateways that put many models behind one interface, and local runtimes for open models — the layer you swap when cost, latency, or privacy needs change.",
      ko: '에이전트의 추론이 실제로 일어나는 곳입니다. 1차 제공자 모델 API, 여러 모델을 하나의 인터페이스 뒤에 두는 게이트웨이, 오픈 모델을 위한 로컬 런타임을 포함합니다. 비용·지연·프라이버시 요구가 바뀔 때 교체하는 계층입니다.',
    },
    children: [
      {
        id: 'llm-foundation',
        label: { en: 'Foundation Model APIs', ko: '파운데이션 모델 API' },
        description: {
          en: 'First-party APIs for frontier models.',
          ko: '프런티어 모델의 1차 제공자 API.',
        },
        detail: {
          en: 'First-party APIs from the labs that build the models. You get the newest capabilities and the most reliable quality, in exchange for per-token pricing and a hosted dependency.',
          ko: '모델을 만드는 연구소의 1차 제공자 API입니다. 토큰당 과금과 호스팅 의존성을 감수하는 대신, 가장 최신 기능과 안정적인 품질을 얻습니다.',
        },
      },
      {
        id: 'llm-gateway',
        label: { en: 'Gateways & Routers', ko: '게이트웨이 & 라우터' },
        description: {
          en: 'One interface that unifies many providers.',
          ko: '여러 제공자를 하나의 인터페이스로 통합하는 도구.',
        },
        detail: {
          en: 'One API in front of many providers. Swap models with a string, add fallbacks and cost-based routing, and avoid locking your code to a single vendor.',
          ko: '여러 제공자 앞에 놓이는 단일 API입니다. 문자열 하나로 모델을 바꾸고 폴백과 비용 기반 라우팅을 더하며, 코드를 특정 벤더에 묶지 않습니다.',
        },
      },
      {
        id: 'llm-local',
        label: { en: 'Local Models', ko: '로컬 모델' },
        description: {
          en: 'Run open models on your own hardware.',
          ko: '오픈 모델을 직접 실행하는 도구.',
        },
        detail: {
          en: 'Run open-weight models on your own hardware. Slower and smaller than frontier APIs, but private, offline-capable, and free of per-token cost.',
          ko: '오픈 웨이트 모델을 직접 하드웨어에서 실행합니다. 프런티어 API보다 느리고 작지만, 프라이빗하고 오프라인에서 동작하며 토큰당 비용이 없습니다.',
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
    detail: {
      en: 'How agents remember. From vector databases for similarity search to higher-level memory layers and the embedding models that feed them, this is the retrieval backbone behind RAG and long-term context.',
      ko: '에이전트가 기억하는 방식입니다. 유사도 검색을 위한 벡터 데이터베이스부터 상위 수준의 메모리 계층, 그리고 이를 채우는 임베딩 모델까지 — RAG와 장기 컨텍스트를 뒷받침하는 검색 백본입니다.',
    },
    children: [
      {
        id: 'vec-db',
        label: { en: 'Vector Databases', ko: '벡터 데이터베이스' },
        description: {
          en: 'Stores for embeddings and similarity search.',
          ko: '임베딩 저장과 유사도 검색을 위한 데이터베이스.',
        },
        detail: {
          en: 'Stores that index embeddings and answer nearest-neighbor queries fast. The core of RAG retrieval — choose by scale, hosting, and whether you want a dedicated engine or a Postgres extension.',
          ko: '임베딩을 색인하고 최근접 이웃 질의에 빠르게 답하는 저장소입니다. RAG 검색의 핵심으로, 규모·호스팅, 그리고 전용 엔진인지 Postgres 확장인지에 따라 고릅니다.',
        },
      },
      {
        id: 'vec-memory',
        label: { en: 'Agent Memory', ko: '에이전트 메모리' },
        description: {
          en: 'Long-term memory layers for agents.',
          ko: '에이전트를 위한 장기 기억 계층.',
        },
        detail: {
          en: 'A layer above raw vectors: it decides what an agent should remember, persists it across sessions, and recalls the relevant pieces back into context.',
          ko: '원시 벡터 위의 계층입니다. 에이전트가 무엇을 기억할지 정하고 세션 사이에 보존하며, 관련된 부분을 컨텍스트로 다시 불러옵니다.',
        },
      },
      {
        id: 'vec-embeddings',
        label: { en: 'Embedding Models', ko: '임베딩 모델' },
        description: {
          en: 'Models that turn text into vectors.',
          ko: '텍스트를 벡터로 변환하는 모델.',
        },
        detail: {
          en: 'Models that turn text into vectors. Their quality and dimensionality set the ceiling for everything retrieval-based downstream.',
          ko: '텍스트를 벡터로 변환하는 모델입니다. 이 모델의 품질과 차원이 이후 검색 기반 작업 전체의 상한을 좌우합니다.',
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
    detail: {
      en: 'Once an agent runs in production you need to see inside it. These tools trace each step, evaluate output quality, track cost and latency, and help you catch regressions before your users do.',
      ko: '에이전트가 프로덕션에서 돌기 시작하면 내부를 들여다봐야 합니다. 각 단계를 트레이싱하고 출력 품질을 평가하며 비용과 지연을 추적해, 사용자보다 먼저 회귀를 잡아내도록 돕는 도구입니다.',
    },
    children: [
      {
        id: 'observability-tracing',
        label: { en: 'Tracing & Monitoring', ko: '트레이싱 & 모니터링' },
        description: {
          en: 'Capture, inspect, and monitor agent runs step by step.',
          ko: '에이전트 실행을 단계별로 기록·점검·모니터링.',
        },
        detail: {
          en: 'See inside a running agent — every LLM call, tool use, latency, and cost — with dashboards and alerts to catch regressions in production.',
          ko: '실행 중인 에이전트의 내부를 본다 — 모든 LLM 호출·도구 사용·지연·비용을 대시보드와 알림으로 추적해 프로덕션 회귀를 잡는다.',
        },
      },
      {
        id: 'observability-eval',
        label: { en: 'Evaluation', ko: '평가' },
        description: {
          en: 'Score and test LLM and RAG output quality.',
          ko: 'LLM·RAG 출력 품질을 채점하고 테스트.',
        },
        detail: {
          en: 'Measure whether output is actually good — faithfulness, relevance, correctness — with metrics and test suites you can run in CI.',
          ko: '출력이 실제로 좋은지 측정한다 — 충실도·관련성·정확성을 지표와 테스트 스위트로, CI에서 실행하도록.',
        },
      },
    ],
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
