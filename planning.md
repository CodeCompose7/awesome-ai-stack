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

새 영역이라 `categories.ts`에 카테고리 항목을 먼저 추가해야 한다.

| 도구 | 제안 카테고리 | 한 줄 | 출처 |
| --- | --- | --- | --- |
| Composio | 도구 연동(tool-use) | 에이전트용 도구·통합 허브 | <https://github.com/ComposioHQ/composio> |
| Browser Use | 브라우저·컴퓨터 사용 | LLM 브라우저 자동화 | <https://github.com/browser-use/browser-use> |
| Stagehand | 브라우저·컴퓨터 사용 | AI 브라우저 자동화 프레임워크 | <https://github.com/browserbase/stagehand> |
| E2B | 코드 샌드박스 | AI 코드 실행 샌드박스 | <https://github.com/e2b-dev/E2B> |
| Tavily | 웹 검색·수집 | 에이전트용 검색 API | <https://tavily.com> |
| Firecrawl | 웹 검색·수집 | 웹 크롤링·마크다운 변환 | <https://www.firecrawl.dev> |
| Exa | 웹 검색·수집 | 신경망 기반 검색 API | <https://exa.ai> |
| Guardrails AI | 가드레일 | 출력 검증·가드레일 | <https://github.com/guardrails-ai/guardrails> |
| NeMo Guardrails (NVIDIA) | 가드레일 | 대화형 가드레일 | <https://github.com/NVIDIA/NeMo-Guardrails> |
| Pipecat | 음성 에이전트 | 실시간 음성·멀티모달 | <https://github.com/pipecat-ai/pipecat> |
| LiveKit Agents | 음성 에이전트 | 실시간 음성 에이전트 | <https://github.com/livekit/agents> |
