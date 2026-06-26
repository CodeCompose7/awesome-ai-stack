# Planning — 카탈로그 추가 후보

AI 에이전트 생태계에서 카탈로그(`src/content/stacks`)에 추가할 만한 도구·서비스
백로그. 우선순위 항목을 먼저 추가하고 나머지는 추후 추가한다.

추가 시 규칙:

- 기존 형식 준수 — frontmatter(`name`·`logo`·`category`·`description`·`website`·
  `repo`·`docs`·`tags`·`language`·`license`·`pricing`·`related`·`samples`) + 본문(개요 +
  코드 샘플 탭 + 언제 쓰면 좋은가), `en`/`ko` 한 쌍.
- 카테고리는 `src/data/categories.ts`의 5개(`frameworks`·`coding-agents`·
  `llm-providers`·`vector-stores`·`observability`) 중에서. 새 영역은 거기에 항목을 먼저 추가.
- 로고는 `public/logos`에 파일을 넣고 frontmatter `logo`로 연결. 단색 로고는 `-mono`
  접미사로 다크 테마에 대응.
- 가능하면 LiteLLM-first + 실행 가능한 Docker 샘플(`samples/<slug>_1`)도 함께.

## 이번에 추가 (기존 카테고리에 들어맞음)

| 도구 | 카테고리 | 한 줄 | 출처 |
| --- | --- | --- | --- |
| CrewAI | frameworks | 역할 기반 멀티에이전트 오케스트레이션 | <https://github.com/crewAIInc/crewAI> |
| Pydantic AI | frameworks | 타입 안전 에이전트(Pydantic 팀) | <https://github.com/pydantic/pydantic-ai> |
| Aider | coding-agents | 터미널 git-native 페어프로그래머 | <https://github.com/Aider-AI/aider> |
| OpenRouter | llm-providers | 300+ 모델 통합 게이트웨이 | <https://openrouter.ai> |
| Qdrant | vector-stores | 오픈소스 벡터 DB | <https://github.com/qdrant/qdrant> |
| Mem0 | vector-stores | 에이전트 메모리 레이어 | <https://github.com/mem0ai/mem0> |
| Arize Phoenix | observability | OSS LLM·에이전트 트레이싱·평가 | <https://github.com/Arize-ai/phoenix> |

## 추후 추가 — 기존 카테고리 보강

- **frameworks**: LlamaIndex <https://github.com/run-llama/llama_index> · AutoGen(MS)
  <https://github.com/microsoft/autogen> · OpenAI Agents SDK
  <https://github.com/openai/openai-agents-python> · smolagents(HF)
  <https://github.com/huggingface/smolagents> · Agno <https://github.com/agno-agi/agno>
- **coding-agents**: Aider 외 — Goose(Block) <https://github.com/block/goose> · Continue
  <https://github.com/continuedev/continue> · opencode(SST) <https://github.com/sst/opencode>
  · Roo Code <https://github.com/RooCodeInc/Roo-Code>
- **llm-providers**: Groq <https://groq.com> · vLLM <https://github.com/vllm-project/vllm>
  · Mistral AI <https://mistral.ai> · LM Studio <https://lmstudio.ai>
- **vector-stores**: Weaviate <https://github.com/weaviate/weaviate> · Milvus
  <https://github.com/milvus-io/milvus> · LanceDB <https://github.com/lancedb/lancedb> ·
  Zep <https://github.com/getzep/zep>
- **observability**: Helicone <https://github.com/Helicone/helicone> · Ragas
  <https://github.com/explodinggradients/ragas> · DeepEval
  <https://github.com/confident-ai/deepeval> · Opik(Comet) <https://github.com/comet-ml/opik>

## 추후 추가 — 새 카테고리 필요 (`categories.ts`에 항목 먼저 추가)

- **도구 연동(tool-use)**: Composio <https://github.com/ComposioHQ/composio>
- **브라우저·컴퓨터 사용**: Browser Use <https://github.com/browser-use/browser-use> ·
  Stagehand <https://github.com/browserbase/stagehand>
- **코드 샌드박스**: E2B <https://github.com/e2b-dev/E2B>
- **웹 검색·수집**: Tavily <https://tavily.com> · Firecrawl <https://www.firecrawl.dev> ·
  Exa <https://exa.ai>
- **가드레일**: Guardrails AI <https://github.com/guardrails-ai/guardrails> · NeMo
  Guardrails(NVIDIA) <https://github.com/NVIDIA/NeMo-Guardrails>
- **음성 에이전트**: Pipecat <https://github.com/pipecat-ai/pipecat> · LiveKit Agents
  <https://github.com/livekit/agents>
