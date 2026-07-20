# ⚡ awesome-ai-stack

[English](../../README.md) | **한국어**

**AI 시스템**을 만들 때 실제로 쓰는 도구와 서비스를 모은 큐레이션 스택 —
프레임워크, LLM 제공자, 벡터 스토어, 서빙, 관측(observability) 등.

[kyrolabs/awesome-agents](https://github.com/kyrolabs/awesome-agents) 같은
목록에서 영감을 받았지만, **단순한 평면 목록이 아닙니다**:

1. **거대한 README가 아니라 실제 웹사이트** — [Astro](https://astro.build)로
   Markdown/MDX에서 빌드합니다.
2. **서비스마다 상세 페이지** — 개요·링크·메타데이터(언어·라이선스·가격)와
   언제 쓰면 좋은지까지.
3. **모든 페이지에 실행 가능한 샘플 코드** — "이게 뭐지"에서 "보여줘"로 한 번에
   내려갑니다.

라이브 사이트: <https://codecompose7.github.io/awesome-ai-stack>

---

## 기술 스택

| 항목        | 선택                                               |
| ----------- | -------------------------------------------------- |
| 사이트 프레임워크 | Astro 5 (정적 출력)                            |
| 콘텐츠      | `@astrojs/mdx` 기반 MDX + 콘텐츠 컬렉션            |
| 스타일링    | Tailwind CSS v4 (`@tailwindcss/vite`)             |
| SEO         | `@astrojs/sitemap`                                 |
| i18n        | Astro i18n (`en` 기본, `ko`는 `/ko/` 아래)         |
| 테마        | npm의 [`stack-site-builder`](https://www.npmjs.com/package/stack-site-builder) |
| 호스팅      | GitHub Pages (`.github/workflows/deploy.yml` 참고) |
| 도구        | Node 24 + pnpm (devcontainer 포함)                 |

## 시작하기

**가장 간편 — 클론 후 Docker만 있으면 됩니다.** 별도 설치가 필요 없습니다:

```bash
docker compose up      # 이미지 빌드, 의존성 설치, `pnpm dev` 실행
```

그리고 <http://localhost:4321/awesome-ai-stack/>를 엽니다. 소스가
바인드마운트되므로 내 컴퓨터에서 파일을 고치면 컨테이너에서 핫리로드됩니다. 이건
**개발 서버**를 띄우는 것입니다.
([`Dockerfile.dev`](../../Dockerfile.dev) + [`docker-compose.yml`](../../docker-compose.yml).)
프로덕션 사이트는 이 이미지가 아니라 배포 워크플로의 정적 빌드입니다. compose는
개발 전용 샘플 **실행** 위저드가 동작하도록 Docker 소켓도 마운트합니다 — 쓰지 않거나
Linux/macOS가 아니면 그 줄을 지우면 됩니다.

**또는 로컬 Node로** (Node ≥ 20, devcontainer는 Node 24)와 **pnpm**:

```bash
pnpm install      # 의존성 설치
pnpm dev          # http://localhost:4321 에서 개발 서버 시작
pnpm build        # dist/ 로 정적 사이트 빌드
pnpm preview      # 프로덕션 빌드를 로컬에서 미리보기
pnpm check        # Astro + 콘텐츠 컬렉션 타입 체크
```

> **VS Code / Dev Containers를 쓰나요?** 폴더를 열고 "Reopen in Container"를
> 선택하세요. devcontainer(`.devcontainer/`)가 Node 24를 제공하고 Corepack으로
> pnpm을 켜며, `pnpm install`을 실행하고 Astro 포트(4321)를 포워딩합니다.

### pnpm 빌드 스크립트에 관한 메모

pnpm 10+는 허용 목록에 없으면 의존성 빌드 스크립트를 실행하지 않습니다. Astro는
`esbuild`와 `sharp`가 필요해서 [`pnpm-workspace.yaml`](../../pnpm-workspace.yaml)에
승인해 두었습니다. postinstall 단계가 필요한 의존성을 추가하면 거기에 함께 넣으세요.

## 콘텐츠 모델: 세 컬렉션

사이트의 모든 것은 세 개의 MDX 콘텐츠 컬렉션이 구동하며, 전부 로케일별로
나뉩니다(`en/`·`ko/` 하위 폴더, 둘 다 같은 파일명):

| 컬렉션     | 위치                        | 렌더 경로             | 무엇인가                                                          |
| ---------- | --------------------------- | --------------------- | ----------------------------------------------------------------- |
| `stacks`   | `<site>/src/content/stacks/`       | `/stack/<slug>/`      | 카탈로그 — 도구/서비스 하나당 항목 하나                            |
| `concepts` | `<site>/src/content/concepts/`     | `/concept/<slug>/`    | 여러 도구를 엮는 상위 패턴 (리빙 도큐먼트)                          |
| `articles` | `<site>/src/content/articles/`     | `/article/<slug>/`    | 글 — 카탈로그와 분리한 장문 포스트                                  |

세 컬렉션 모두 프런트매터는 [`packages/stack-site-builder/src/content.ts`](https://github.com/CodeCompose7/stack-site-builder/blob/main/src/content.ts)의
Zod 스키마로 빌드 시점에 검증됩니다. 오타나 필수 필드 누락은 `pnpm build`·`pnpm check`를
실패시키므로, 깨진 항목은 배포될 수 없습니다.

상세 페이지 외에 **둘러보기 페이지**도 있고, 전부 같은 프런트매터에서 생성됩니다:
`/categories/<id>/`(도구 카테고리 트리), `/concept/category/<id>/`와
`/article/category/<id>/`(각자의 분류 체계), `/tags/<tag>/`, `/vendors/<vendor>/`,
그리고 검색 가능한 `/glossary/`.

## 하나의 테마, 여러 사이트

사이트와 무관한 모든 것 — 라우트, 컴포넌트, 스타일, 마크다운 파이프라인,
콘텐츠 스키마 — 은 npm으로 설치하는 [`stack-site-builder`](https://github.com/CodeCompose7/stack-site-builder)
테마에 있습니다. 이 저장소는 이 사이트를 이 사이트이게 하는 것만 담습니다:
콘텐츠, 분류 데이터, 정체성, 그리고 작은 설정. 같은 엔진으로 카탈로그를 하나
더 만들 때는 테마에 의존하는 얇은 저장소를 하나 더 만들면 되고, 테마 업데이트는
`pnpm up stack-site-builder`로 받는 평범한 버전 업그레이드입니다.

## 프로젝트 구조

```text
astro.config.mjs                # site/base/i18n + aasTheme({ glossary }) — 나머지는 테마가 함
src/
├─ content.config.ts            # 호출 한 번: defineAasCollections({ categoryMap })
├─ content/
│  ├─ stacks/{en,ko}/*.mdx      # 로케일당 도구 하나        ← 도구는 여기에 추가
│  ├─ concepts/{en,ko}/*.mdx    # 조합 패턴                 ← 개념은 여기에 추가
│  ├─ articles/{en,ko}/*.mdx    # 글/블로그 포스트          ← 글은 여기에 추가
│  └─ slides/{en,ko}/*.mdx      # 프레젠테이션 덱
├─ data/
│  ├─ site.ts                   # 사이트 정체성: 이름, 저장소 URL, UI 문자열 오버라이드
│  ├─ categories.ts             # 도구 카테고리 트리 (중첩 children, 로케일별 라벨)
│  ├─ concept-categories.ts     # 개념 분류
│  ├─ article-categories.ts     # 글 분류
│  └─ glossary.mjs              # [[용어]] 위키링크 용어집 (아래 참고)
└─ assets/                      # 본문 이미지 (@assets/... 별칭)
public/logos/                   # 도구 로고
samples/                        # 실행 가능한 미니 프로젝트 (구현 탭)
```

## 국제화 (EN / KO)

사이트는 이중 언어입니다. `en`이 기본 로케일(루트에서 서빙)이고 `ko`는 `/ko/`
아래에서 서빙되며, [`astro.config.mjs`](../../astro.config.mjs)의 Astro `i18n`으로
설정합니다. 헤더의 언어 토글이 같은 페이지의 다른 로케일로 연결됩니다.

- **UI 문자열**은 [`src/i18n/ui.ts`](https://github.com/CodeCompose7/stack-site-builder/blob/main/src/i18n/ui.ts)의 `ui` 사전에 있습니다.
- **카테고리 라벨**은 [`src/data/categories.ts`](../../src/data/categories.ts)에
  로케일별로 있습니다. (개념·글 분류 체계도 그 옆에 함께 있습니다.)
- **콘텐츠**는 로케일당 MDX 파일 하나입니다: `content/<collection>/en/<slug>.mdx`와
  `content/<collection>/ko/<slug>.mdx`. 스위처가 맞물리도록 둘 다 **같은 slug**를
  유지하세요. 코드 샘플은 보통 동일하고 산문만 번역합니다.

## 상세 탭: 개요 + 버전별 코드 샘플

도구가 프런트매터에 `samples`를 정의하면 상세 페이지가 두 탭으로 나뉩니다 —
**개요**(MDX 본문 · 산문과 다이어그램)와 **코드 샘플**(스니펫의 버전 선택기)입니다.
[`content/stacks/{en,ko}/langgraph.mdx`](../../src/content/stacks/en/langgraph.mdx)가
실제 예시입니다.

```yaml
samples:
  - version: "0.2 · Graph API"   # 선택기에 표시되는 라벨
    lang: python                 # 문법 하이라이트 언어 (Shiki, 빌드 시점)
    description: |               # 코드 위에 표시되는 선택적 Markdown 설명
      **graph API**는 명시적입니다: 노드와 그 사이의 엣지.
    diagram: |                   # 선택적 Mermaid 구조 다이어그램
      flowchart LR
        START([START]) --> think[think]
    code: |
      from langgraph.graph import StateGraph
      ...
    note: 코드 아래 한 줄 설명.                   # 선택
```

상세 페이지는 오른쪽에 고정된 **목차**(h2–h3, `render()`의 `headings`에서)도
렌더합니다. 코드 탭에서는 이것이 버전 목록이 됩니다.

### 실행 가능한 샘플 ("구현" 탭)

설명용 코드 샘플 외에, 도구는 하나 이상의 **실제로 실행 가능한 미니 프로젝트**를
`samples/` 아래 독립 폴더로 담을 수 있습니다(소스, `Dockerfile`, README — 예:
[`samples/langgraph_1/`](../../samples/langgraph_1/)). 프런트매터에 나열합니다 —
폴더 이름만 쓰거나, 그 프로젝트가 쓰는 다른 카탈로그 도구까지 지정하는 객체로:

```yaml
projects: [langgraph_1, langgraph_2]
# 또는 사이드바용 관련 도구와 함께:
projects:
  - folder: langgraph_1
    related: [langgraph, litellm]
```

그러면 상세 페이지에 **구현** 탭
([`ProjectViewer`](https://github.com/CodeCompose7/stack-site-builder/blob/main/src/components/ProjectViewer.astro))이 뜨고, 프로젝트마다
[`src/lib/project.ts`](https://github.com/CodeCompose7/stack-site-builder/blob/main/src/lib/project.ts)가 빌드 시점에:

- `README.md`를 산문으로 렌더하고(첫 `#` 헤딩이 프로젝트 이름이 됨),
- 왼쪽에 **파일 트리**를 보여주며, 파일을 클릭하면 문법 하이라이트되어 표시되고,
- GitHub의 해당 폴더로 링크합니다.

`projects`가 여러 개면 **예제** 드롭다운으로 전환됩니다. GitHub Pages는 코드를
실행할 수 없으므로, 방문자는 폴더를 받아 Docker로 실행합니다 — `docker build` 후,
각 샘플 README가 보여주는 `docker run --env-file .env`. 글도 `project` 프런트매터
필드와 `<SampleProject folder="…"/>`로 자기 샘플에 같은 뷰어를 임베드할 수 있습니다.

- **Mermaid** 다이어그램은 개요 본문(```mermaid 펜스 블록)과 샘플별 `diagram:`
  모두에서 동작합니다. 클라이언트에서 렌더되며 라이트/다크 테마에 맞춰 색이
  바뀝니다([`MermaidLoader.astro`](https://github.com/CodeCompose7/stack-site-builder/blob/main/src/components/MermaidLoader.astro)).
- 코드는 **빌드 시점**에 Shiki로 하이라이트됩니다.
- `samples`가 없는 도구는 MDX 본문을 그대로 렌더합니다 — 탭이 없습니다. 그래서 이
  방식은 도구별로 선택적·점진적으로 도입할 수 있습니다.

## 라이브 데이터 (GitHub 스타 & 버전)

카드와 상세 페이지는 GitHub `repo`가 있는 도구의 스타 수와 최신 버전을 보여줍니다 —
손으로 입력하는 게 아니라 **빌드 시점에 가져옵니다**. 로직은
[`src/lib/github.ts`](https://github.com/CodeCompose7/stack-site-builder/blob/main/src/lib/github.ts)에 있습니다. 레포별로 메모이즈되고
`.aas-cache/`에 약 하루 단위로 캐시되며, 오류/오프라인/레이트리밋 시 마지막으로
알려진 값으로 우아하게 폴백합니다.

- 이 값들은 **마지막 빌드 시점** 기준의 실제 상태를 반영합니다. 배포 워크플로가 매
  푸시마다, 그리고 **매일 `schedule:` cron**으로도 돌아서 코드 변경 없이도 숫자가
  최신으로 유지됩니다.
- CI는 60req/시간 비인증 레이트리밋을 풀기 위해 빌드에 `GITHUB_TOKEN`을 넘깁니다.
  로컬에서는 비인증 요청으로도 보통 충분합니다.
- GitHub에 없는 도구(예: 폐쇄형 SaaS)는 프런트매터에 `version:`을 수동 폴백으로
  설정하세요. `repo`가 있으면 라이브 릴리스가 우선합니다.

## 용어집 & `[[Term]]` 위키링크

어느 컬렉션의 산문이든 `[[Term]]`(또는 `[[Term|표시 텍스트]]`)로 용어를 링크할 수
있습니다. 테마 마크다운 파이프라인([`packages/stack-site-builder/markdown.mjs`](https://github.com/CodeCompose7/stack-site-builder/blob/main/markdown.mjs))의 `remarkGlossary` 플러그인이
각 마커를 중앙 용어집([`src/data/glossary.mjs`](../../src/data/glossary.mjs))에
대조해 빌드 시점에 해석합니다:

- 용어는 **stack**, **concept**, **article**, 외부 **href**를 타깃으로 하거나,
  아무것도 없으면 — 정의 전용 용어로 `/glossary/` 페이지의 자기 항목으로 링크됩니다.
- 조회는 로케일 인식형입니다: `[[도구]]`, `[[Tools]]`, `[[agent-tools]]`가 모두
  같은 항목으로 해석되며 페이지 로케일에 맞는 라벨로 렌더됩니다.
- **알 수 없는 용어는 빌드를 실패**시키므로, 오타가 조용히 텍스트로 렌더될 수
  없습니다.
- `/glossary/` 페이지는 모든 용어를 검색·카테고리 그룹핑과 함께 나열합니다.

## 글쓰기(블로그) & 백링크

글은 별도의 `articles` 컬렉션(`content/articles/{en,ko}/`)에 있고 `/article/`
아래에서 렌더되며, 도구 카탈로그와 분리돼 있습니다. 글의 프런트매터는 참조하는
도구 slug들을 나열합니다:

```mdx
---
title: 'Langfuse vs LangSmith: choosing an LLM observability stack'
description: 카드와 <head>용 한 줄 요약.
date: 2026-06-22
category: article-comparisons  # src/data/article-categories.ts의 리프 id
tools: [langfuse, langsmith]   # 이 글이 참조하는 stack slug들
tags: [observability, comparison]
draft: false                   # 선택; draft는 빌드에서 제외
---
```

이 하나의 `tools` 목록이 **양방향** 링크를 구동합니다:

- **정방향**(글 → 도구): `ArticleDetail`이 각 slug를 도구의 로케일별 이름으로
  해석해 그 페이지로 링크합니다. 산문에서는 base 무관 상대 경로로도 링크할 수
  있습니다. 예: `[Langfuse](../../stack/langfuse/)` — 또는 그냥 `[[Langfuse]]`로 쓰면
  용어집이 해석합니다.
- **백링크**(도구 → 글): Astro에는 **네이티브 백링크가 없어서**,
  [`getArticlesForTool()`](https://github.com/CodeCompose7/stack-site-builder/blob/main/src/lib/articles.ts)이 빌드 시점에 역방향 조회를
  계산합니다. `StackDetail`이 그 slug를 `tools`에 포함한 모든 글의 "관련 글" 목록을
  보여줍니다. 글에 slug를 추가하면 백링크가 자동으로 생기고, 손으로 관리할 게
  없습니다.

개념도 반대 방향으로 같은 방식입니다: 개념의 `tools`(역할별 그룹)와 `articles`
프런트매터가 카탈로그 항목·글과 이어지고, 그 페이지들이 다시 이어 줍니다.

## 도구 추가하기

로케일당 MDX 파일 하나를 `src/content/stacks/en/`와 `src/content/stacks/ko/`에
넣습니다 — 둘 다 **같은 파일명**을 씁니다. 파일명이 URL slug가 됩니다:
`langgraph.mdx`는 `/stack/langgraph/`와 `/ko/stack/langgraph/`가 됩니다.

```mdx
---
name: LangGraph
category: framework-orchestration  # src/data/categories.ts 트리의 아무 노드 id
description: 카드와 상세 헤더에 표시되는 한 줄 요약.
vendor: LangChain             # 선택; /vendors/<slug> 둘러보기 페이지를 구동
logo: /logos/langgraph.svg    # 선택 이미지; 없으면 색상 모노그램이 생성됨
website: https://example.com  # 선택
repo: https://github.com/...  # 선택; 라이브 스타/버전을 켬
docs: https://docs.example.com # 선택
tags: [orchestration, python] # 선택; /tags/<tag> 페이지를 구동
language: Python / JS         # 선택
license: MIT                  # 선택; 카드·상세에 칩으로 표시
pricing: [open-source, paid]  # 선택 목록: open-source | free-tier | paid | free
version: 0.2.1                # 선택 폴백; `repo`가 있으면 라이브 GitHub 릴리스가 우선
featured: true                # 선택: 카테고리 내에서 먼저 정렬
---

## Overview

무엇이고 에이전트 구축에 왜 중요한지 설명합니다.

## Sample: <무엇을 하는지>

​```ts
// 짧고 실행 가능한 스니펫 — 차별점. 초점을 좁게 유지하세요.
​```

## When to use it

강점이 드러나는 지점을 한두 문장으로.
```

스키마([`packages/stack-site-builder/src/content.ts`](https://github.com/CodeCompose7/stack-site-builder/blob/main/src/content.ts))는 필요할 때 더
많은 것을 지원합니다: `formerNames`, `pricingTiers`/`pricingNote`/`pricingSource`,
`related` 도구, `deprecated`, `docVersion`/`updated`, 그리고 위에서 설명한
`samples`/`projects` 필드.

**새 카테고리**를 추가하려면 [`src/data/categories.ts`](../../src/data/categories.ts)의
트리에 노드를 추가하세요 — 최상위든 `children` 아래 중첩이든 가능하며, id는 트리
전체에서 유일해야 합니다. 홈 섹션은 최상위 순서대로 렌더됩니다.

## 배포

`main`에 푸시하면 [`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml)이
트리거되어 Astro로 빌드하고 GitHub Pages에 게시합니다. 라이브 GitHub 통계를 새로
고치기 위해 매일 cron으로도 돌아갑니다. `site`와 `base`는 GitHub 프로젝트 페이지에
맞춰 [`astro.config.mjs`](../../astro.config.mjs)에 설정돼 있습니다. 커스텀 도메인을
쓰려면 `site`를 도메인으로, `base`를 `'/'`로 바꾸고 `public/CNAME`을 추가하세요.

## 기여

도구를 추가하거나 샘플을 개선하거나 메타데이터를 고치는 PR을 환영합니다. 콘텐츠
스키마가 초록불을 유지하도록 PR을 열기 전에 `pnpm check`를 실행해 주세요.
