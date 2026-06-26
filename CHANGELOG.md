# 변경 이력

이 프로젝트의 모든 주요 변경사항은 이 파일에 기록됩니다.

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)를 따르며,
이 프로젝트는 [Semantic Versioning](https://semver.org/lang/ko/)을 준수합니다.

이 저장소는 AI 에이전트 도구·스택을 한눈에 비교하는 큐레이션 카탈로그 사이트
(awesome-agent-stack)입니다. Astro로 만든 정적 사이트이며 도구 카탈로그, 블로그,
실행 가능한 예제(`samples/`)를 한국어·영어로 제공하고 GitHub Pages로 배포됩니다.
1.0.0은 카탈로그·상세 페이지·예제·다국어를 갖춘 첫 정식 릴리스를 뜻합니다.

## 1.2.0 - 2026-06-26

카탈로그에 스택 6종과 각각의 실행 가능한 구현 샘플을 추가하고, 실제 로고를 입혔으며,
모바일 레이아웃을 정리했습니다.

### 추가됨 1.2.0

- **새 스택 6종** — instructor·Sentence Transformers·Chroma·Google Gemini·OpenAI·
  Ollama. 카탈로그가 11개에서 17개가 됐고, 기존 형식(개요·코드 샘플 탭·다이어그램·언제
  쓰나)에 맞춰 한/영으로 작성
  - 구조화 출력 instructor, 임베딩 Sentence Transformers, 벡터 DB Chroma,
    프로바이더 Gemini·OpenAI·Ollama
- **구현 샘플 6종** — `instructor_1`·`sentence-transformers_1`·`chroma_1`·`gemini_1`·
  `openai_1`·`ollama_1`. 모두 Docker로 실행되며 DooD로 동작 검증
  - 프로바이더(openai·gemini)는 네이티브 SDK, `ollama_1`은 LiteLLM `ollama_chat/`로
    로컬 모델 호출
  - `instructor_1`은 `from_litellm`으로 Pydantic 검증 출력, `chroma_1`·
    `sentence-transformers_1`은 키 없이 로컬 임베딩(결정적 출력)
- **실제 로고 적용** — 6개 스택에 로고 파일을 입혀 이모지·모노그램을 대체

### 변경됨 1.2.0

- **모바일 헤더** — 좁은 폭에서 nav 라벨을 아이콘으로 바꾸고(데스크톱은 텍스트 유지),
  600px 미만에선 로고 워드마크를 숨겨 ⚡만 표시, 언어 전환기는 짧은 코드(KO·EN)로
- **카드 레이아웃** — 1000px 미만에서 세로로 쌓아 스타·가격 칩을 본문 아래로 내려
  제목·설명이 폭을 온전히 쓰게 함. 1000px 이상은 기존 우측 컬럼 유지
- 새 샘플의 의존성 floor를 현재 메이저로 상향 — openai 2.x·google-genai 2.x·
  chromadb 1.x·sentence-transformers 5.x 등

### 수정됨 1.2.0

- **단색 로고가 다크 테마에서 보이지 않던 문제** — 파일명 `-mono` 규칙으로 마스크
  처리해 테마 전경색(라이트=어둡게, 다크=밝게)으로 칠함. instructor 로고에 적용

## 1.1.0 - 2026-06-25

거의 모든 스택에 코드 샘플과 **실행 가능한 구현 샘플**을 붙이고, 로컬 Ollama 모델을
지원하며, 각 구현 샘플 README에 실제 실행 결과를 기록했습니다.

### 추가됨 1.1.0

- **구현 샘플 8종 신설** — `litellm_1`·`dspy_1`·`pgvector_1`·`mini-swe-agent_1`·
  `anthropic-claude_1`·`openhands_1`·`langfuse_1`·`langsmith_1`. 모두 Docker 또는
  docker-compose로 바로 실행되며 DooD 환경에서 동작을 검증
  - `openhands_1` — OpenHands Agent SDK의 로컬 워크스페이스로 중첩 Docker 샌드박스
    없이 헤드리스 실행
  - `langfuse_1` — docker-compose로 Langfuse 전체 스택(Postgres·ClickHouse·Redis·
    MinIO·web·worker)을 띄우고 `LANGFUSE_INIT_*`로 키를 부트스트랩, 트레이스를 API로
    다시 읽어 왕복 검증
  - `langsmith_1` — `@traceable`로 호출을 트레이싱하고 SDK로 run을 다시 읽어 검증
  - `pgvector_1` — compose로 pgvector Postgres를 띄워 코사인 거리 최근접 이웃 조회
- **코드 샘플 탭 확충** — 그동안 비어 있던 스택들(LiteLLM·DSPy·pgvector·Anthropic
  Claude·mini-SWE-agent·SWE-agent·Cline·Langfuse·LangSmith·OpenHands)에 버전별 코드
  샘플과 다이어그램 추가
- **Ollama(로컬 모델) 지원** — litellm 라우팅 샘플 전체에 `ollama_chat/<model>`
  MODEL 옵션과 `OLLAMA_API_BASE` 추가. DooD에서는 `host.docker.internal`로 호스트
  Ollama에 접속하고, 도구 호출에는 chat 엔드포인트(`ollama_chat/`)가 필요함을 안내
- **구현 샘플 README의 "실행 결과" 섹션** — 실제 실행 출력을 기록. LLM 샘플은 매번
  결과가 달라질 수 있음을, pgvector는 결정적임을 함께 명시

### 변경됨 1.1.0

- litellm가 3.14를 지원하지 않아 샘플 베이스 이미지를 `python:3.12-slim` →
  `python:3.13-slim`으로 상향
- 모든 스택 개요(개요/Overview)를 문장별 줄바꿈(두 칸 공백 하드 브레이크)으로 통일
- mini-SWE-agent 구현 샘플의 import 시작 배너를 `MSWEA_SILENT_STARTUP`으로 숨김

### 수정됨 1.1.0

- **Ollama 도구 호출이 빈 출력으로 끝나던 문제** — `ollama/`(generate 엔드포인트)를
  `ollama_chat/`(chat 엔드포인트)로 바꿔 함수 호출이 동작. langgraph 샘플은 thinking
  모델의 리스트 content에서 텍스트만 추출하도록 보정
- `langgraph_1`의 DooD 설명을 다른 샘플과 동일하게 정정 — hard-kill 오해 대신 attach
  스트림 드롭으로 기술
- 한국어 README의 문장 끝 `).` 회피(가이드 준수)와 LangSmith 환경변수 표 정렬 경고를
  리스트로 해소
- 한/영 콘텐츠 정합 — langfuse-vs-langsmith 가격 행의 Langfuse 셀을 영문에 맞춰 '무료
  클라우드 티어'로 정정

### 문서 1.1.0

- `docs/markdown-style.md`에 단락 내 줄바꿈(두 칸 공백 하드 브레이크) 규칙 추가
- `pgvector_1`은 compose가 `DATABASE_URL`을 주입하므로 `.env`가 불필요함을 명시

## 1.0.1 - 2026-06-24

루트 홈에서 브라우저 언어를 감지해 제공 언어로 안내합니다.

### 추가됨 1.0.1

- **브라우저 언어 자동 감지** — 기본 언어(en) 루트 홈에 처음 들어오면 `navigator.language`에
  맞는 제공 언어(en·ko)로 페인트 전에 이동(`location.replace`라 히스토리는 남기지 않음).
  언어 전환기로 직접 고른 선택은 `localStorage`에 저장돼 우선하고, 미지원 언어는 기본 언어를 유지

## 1.0.0 - 2026-06-24

첫 정식 릴리스. 예제 2종, URL 상태 모델 통일, README 다국어, 배포 정비로
전체를 다듬었습니다.

### 추가됨 1.0.0

- **두 번째 예제 `samples/langgraph_2`** — `StateGraph` API로 ReAct 루프를 직접
  배선하고 각 단계를 스트리밍하는 예제. 도구는 `tools/` 패키지로 분리
- **접을 수 있는 파일 트리** — 폴더를 펴고 접을 수 있고, 접힘 상태를 localStorage에
  유지. 구현 샘플 README의 목차(h2·h3)를 오른쪽 레일에 표시
- **README 다국어** — `README.<lang>.md`(예: `README.ko.md`)가 있으면 그 언어를,
  없으면 `README.md`로 폴백. 두 예제의 한국어 README 추가
- 구현 샘플 README의 `mermaid` 코드 블록을 다이어그램으로 렌더

### 변경됨 1.0.0

- **상태를 URL 쿼리 파라미터로 통일** — 탭 `?tab`, 예제·파일 `?ex`·`?file`, 코드
  예제 버전 `?v`. 해시 `#`는 섹션 스크롤 전용. 탭을 바꾸면 다른 탭이 소유한
  파라미터를 정리하고, 구현 샘플은 기본 선택도 URL에 반영
- 언어를 바꿔도 현재 쿼리·해시(탭·예제·파일·섹션)를 유지
- 파일을 누르면 해당 코드 위치로 스크롤. 코드 예제 선택 라벨 `버전` → `예제`
- 본문(prose) 링크의 상시 밑줄 제거 — 색으로 구분하고 hover에서만 밑줄
- pnpm을 `11.7.0`으로 고정(`package.json`·devcontainer·CI 정합)

### 수정됨 1.0.0

- **favicon 경로 깨짐** — `BASE_URL`에 후행 슬래시가 없어 `…stackfavicon.svg`로
  빌드돼 404였던 것을 정정. 아이콘도 헤더의 ⚡와 같은 골드 번개로
- **`blank output` 설명 정정** — `litellm` import 시 출력이 비는 현상을 "메모리 부족"
  오해에서, attached stdio 환경(devcontainer + DooD)의 hard-kill로 정확히 기술하고
  detached 실행법을 안내(두 예제 모두)
- 무효한 섹션 해시여도 `?ex`·`?file`이 있으면 구현 샘플 탭을 선택

### 문서 1.0.0

- Markdown 작성 가이드(`docs/markdown-style.md`) 신설 — 한국어 산문에서 문장 끝
  `).`(괄호+마침표) 회피 등. `CLAUDE.md`에서 참조해 AI 보조 작업에도 적용
- 코드 예제 버전 라벨을 `1.x`로 현행화하고, 실제로 돌아가는 구현 샘플로 연결하는 노트 추가

## 0.3.0 - 2026-06-23

홈 탐색과 구현 샘플. 검색·필터·정렬을 넣고, 실행 가능한 예제를 상세 페이지에 붙였습니다.

### 추가됨 0.3.0

- **구현 샘플 탭** — 실행 가능한 LangGraph 예제(`samples/langgraph_1`)를 README 본문 +
  파일 트리 + 예제 드롭다운으로 제공. `samples/<folder>/`를 그대로 읽어 렌더
- **홈 검색·필터·정렬** — 클라이언트에서 키워드 검색, 다중 선택 필터, 정렬
- 상세 페이지 **관련 도구 카드** 섹션, 카테고리 아이콘 아바타, 실제 로고들
- `langgraph_1` — LiteLLM 멀티 프로바이더(`.env`의 `MODEL` 하나로 교체) + `create_agent`

### 변경됨 0.3.0

- gitignore된 파일(`.env` 등)은 파일 트리에서 숨김
- 외부 클릭·Esc로 드롭다운 닫기, 커스텀 체크박스·셰브런 아이콘

## 0.2.0 - 2026-06-22

다국어·테마·라이브 통계, 그리고 상세 탭. 카탈로그를 읽을 만한 사이트로 키웠습니다.

### 추가됨 0.2.0

- **한국어·영어 이중 언어** 모드와 언어 전환기
- **라이트/다크/시스템 테마** 토글
- 빌드 타임 **GitHub 스타·버전·릴리스 날짜**(일일 캐시), 라이선스·가격 태그
- **상세 탭(개요·코드 샘플)** — 버전별 코드 샘플 + Mermaid 다이어그램, 사이트 팔레트로
  테마링된 다이어그램, 스크롤 동기화 오른쪽 레일 TOC와 "맨 위로"
- 블로그(글) 공간과 도구 간 양방향 링크

### 변경됨 0.2.0

- 외부 링크는 새 탭에서 열기, 헤딩(h2·h3)에 복사 링크 앵커
- 상세 탭 선택을 URL에 반영해 딥링크·새로고침에서 복원

## 0.1.0 - 2026-06-22

사이트 스캐폴드와 도구 카탈로그. 카드와 상세 페이지의 뼈대를 세웠습니다.

### 추가됨 0.1.0

- **개발 환경** — VSCode devcontainer(Node 24 · pnpm · Docker-outside-of-Docker),
  Astro 정적 사이트, Tailwind
- **도구 카탈로그** — 카드(로고·카테고리·라이선스·가격 태그)와 상세 페이지(개요 Markdown)
- 코딩 에이전트 등 카테고리와 초기 도구 항목(LiteLLM·LangGraph·Langfuse·LangSmith·
  DSPy·SWE-agent 등)
