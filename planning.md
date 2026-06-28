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

## 설계 노트 — 개념(Concepts) 콘텐츠 타입

### 배경

지금 사이트의 콘텐츠는 두 종류다.

1. **카탈로그**(`src/content/stacks`) — 개별 도구·서비스 하나하나.
2. **글**(`src/content/articles`) — 시간순 장문 글.

여기에 **세 번째 타입 "개념(Concepts)"** 을 더한다. 개별 도구가 아니라, 도구들을
**조합해 만드는 상위 패턴·아키텍처**를 설명한다. 예: *하네스 엔지니어링*, *에이전틱
RAG*, *멀티 에이전트 오케스트레이션*. 각 개념은 거기서 **쓰는 도구(1)** 와 **관련
글(2)** 을 한곳에 엮어 보여준다.

핵심 모델 차이 — stacks는 "단일 도구", articles는 "시간순 글", concepts는 "패턴/구성".
frontmatter·정렬·링크 구조가 서로 달라 **별도 컬렉션**으로 분리하는 게 깔끔하다.

### 1. 만드는 방식 (아키텍처)

- **새 콘텐츠 컬렉션 `concepts`** — stacks·articles와 동형. 로케일 분할 MDX:
  `concepts/en/<slug>.mdx`, `concepts/ko/<slug>.mdx`.
- **frontmatter 스키마(안)** — `src/content.config.ts`에 추가:
  - `title`, `description`
  - `tools` — 이 개념이 쓰는 stack 슬러그 배열. 역할별로 묶고 싶으면
    `[{ role, tools: [slug] }]` 구조도 고려한다 — 예: 추론은 langgraph, 메모리는 mem0.
  - `articles` — 관련 article 슬러그 배열로, 글과 정방향 링크.
  - `related` — 관련 concept 슬러그로, 개념 간 교차 링크.
  - `tags`, `order`/`featured`, `draft`
  - (선택) `diagram` — 대표 mermaid. 본문에서 직접 그려도 됨.
- **본문(MDX)** — 개념 설명 + mermaid 다이어그램. 기존 prose·mermaid 파이프라인 재사용.
- **라우팅** — `/concepts`(인덱스), `/concepts/<slug>`(상세)와 `/ko/...`. 헤더 내비에
  "개념" 항목 추가.
- **상세 페이지 섹션**:
  1. 제목 + 한 줄 설명
  2. 본문(설명 + 구성 다이어그램)
  3. "이 개념에 쓰는 도구" — 카탈로그 카드·링크로, 역할별 그룹도 가능. `StackCard` 재사용.
  4. "관련 글" — `ArticleCard` 재사용.
  5. "관련 개념"(선택)
- **역링크(backlinks)** — 기존 도구↔글 역링크(`lib/articles.ts`) 패턴 재사용:
  - 도구 상세에 "이 도구가 쓰이는 개념"을 표시 — concept→tools 역계산.
  - 글 상세·카드에 "관련 개념"을 선택적으로 표시.
  - lib 헬퍼: `getConceptsForTool(slug)`, `getConceptsForArticle(slug)`.
- **재사용 컴포넌트** — `StackCard`·`ArticleCard`·`Breadcrumb`·`Toc`·`MermaidLoader`·
  prose 스타일을 그대로 활용. 새로 만들 것은 `ConceptIndex`·`ConceptDetail`·
  `concepts/[slug]` 페이지 정도.

### 2. 어떤 내용 (개념 후보 + 페이지 구성)

각 개념 페이지 공통 구성: **정의 → 왜 필요 → 패턴·구성도(역할별 도구) → 선택 기준·
트레이드오프 → 쓰는 도구 → 관련 글**.

후보 개념(괄호 안은 주로 엮이는 카탈로그 영역):

- **하네스 엔지니어링** — 스캐폴딩·제어 루프·도구·평가로 LLM을 감싸 신뢰성을 끌어올리는
  방법. 엮임: frameworks·coding-agents·observability·guardrails
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

### 열린 결정 (착수 전에 정할 것)

- **용어·URL** — 경로를 `/concepts`·`/patterns`·`/guides` 중 무엇으로, 한글 라벨을
  "개념"·"패턴"·"가이드" 중 무엇으로 할지.
- **도구 연결 형태** — 단순 슬러그 배열로 갈지, 역할 그룹(`{ role, tools }`)으로 갈지.
- **역링크 범위** — 1차 출시에 도구 상세의 "쓰이는 개념" 역링크까지 넣을지.
- **출시 규모** — *하네스 엔지니어링* 1개로 형식을 확정(파일럿)한 뒤 3~4개로 확장.

### 추천 (1차)

별도 `concepts` 컬렉션 + `/concepts` 라우트 + 상세 섹션(본문·쓰는 도구·관련 글)으로
시작하고, **하네스 엔지니어링 하나를 파일럿**으로 만들어 형식을 굳힌다. 역할 그룹과
도구 상세 역링크는 형식이 자리 잡은 뒤 2차로 더한다.
