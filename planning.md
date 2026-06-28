# Planning — 카탈로그 추가 후보

AI 에이전트 생태계에서 카탈로그(`src/content/stacks`)에 추가할 만한 도구·서비스
백로그. 우선순위 항목을 먼저 추가하고 나머지는 추후 추가한다.

추가 시 규칙:

- 기존 형식 준수 — frontmatter(`name`·`logo`·`category`·`description`·`website`·
  `repo`·`docs`·`tags`·`language`·`license`·`pricing`·`related`·`samples`) + 본문(개요 +
  코드 샘플 탭 + 언제 쓰면 좋은가), `en`/`ko` 한 쌍.
- 카테고리는 `src/data/categories.ts`의 트리 — 상위 5개(`frameworks`·
  `coding-agents`·`llm-providers`·`vector-stores`·`observability`)와 그 아래 서브카테고리
  — 중 가장 구체적인 노드로. 새 영역·서브카테고리는 거기에 항목을 먼저 추가.
- 로고는 `public/logos`에 파일을 넣고 frontmatter `logo`로 연결. 단색 로고는 `-mono`
  접미사로 다크 테마에 대응.
- 가능하면 LiteLLM-first + 실행 가능한 Docker 샘플(`samples/<slug>_1`)도 함께.

## 추후 추가 — 새 카테고리 필요

현재 백로그 없음 — 직전 후보 11종은 v1.5.0에서 에이전트 도구·연동·가드레일·음성 에이전트
카테고리로 모두 추가했다.

---

## 개념(Concepts) — 추가 후보

개념(Concepts) 콘텐츠 타입은 v1.7.0에서 도입했다. *하네스 엔지니어링*을 파일럿으로
형식을 확정했고, 컬렉션·역할 그룹 도구 연결(`tools: [{ role, tools }]`)·역링크·라우팅·
상세 페이지 구성은 모두 코드에 반영했다. 다음에 추가할 개념 후보(괄호는 주로 엮이는
카탈로그 영역):

- **에이전틱 RAG** — 검색으로 근거를 대고 답하는 구성. 엮임: framework-rag·
  vector-stores·embeddings·웹 수집
- **멀티 에이전트 오케스트레이션** — 여러 에이전트의 협업·핸드오프. 엮임:
  framework-orchestration·llm·observability
- **평가 주도 개발(eval loop)** — 지표·테스트로 품질을 측정하며 개선. 엮임:
  observability-eval·tracing·frameworks
- **에이전트 메모리 아키텍처** — 세션을 넘는 기억. 엮임: vec-memory·vec-db·embeddings
- **도구 사용·함수 호출** — 에이전트가 외부 도구를 호출하는 방식. 엮임:
  tool-integrations·frameworks
- **가드레일·안전 계층** — 입출력 검증·정책. 엮임: guardrails·observability
- **관측 스택** — 트레이싱·비용·평가를 합친 운영 계층. 엮임: observability·llm-gateway
- **웹 접근 파이프라인** — 검색→스크래핑→브라우저 제어. 엮임: tool-web·tool-browser
- **코드 실행 샌드박스** — 모델이 짠 코드를 격리 실행. 엮임: tool-sandbox·coding-agents
- **음성 에이전트 파이프라인** — STT→LLM→TTS 실시간 루프. 엮임: voice-agents·llm
- **로컬·셀프호스트 스택** — 키 없이 자체 인프라로. 엮임: llm-local·오픈소스 도구
- **프롬프트 최적화·프로그래밍** — 문자열 튜닝 대신 컴파일·최적화. 엮임:
  framework-prompt·eval
- **게이트웨이·라우팅** — 폴백·비용 기반 모델 전환. 엮임: llm-gateway
