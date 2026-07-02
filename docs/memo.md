# 코드 점검 메모 (2026-07-02)

전체 코드 점검 결과 중 **고쳐야 할 것**을 우선순위별로 정리한 메모.
`pnpm check`(85파일, 오류 0)와 `pnpm build`(534페이지)는 모두 통과했고,
en/ko 페이지 쌍 동기화·base 경로 처리·시크릿 유출·배포 워크플로는 이상 없음이
확인된 상태 — 아래는 그 위에서 발견된 결함 목록이다.

## HIGH — 반드시 수정s

### 1. ~~GitHub 캐시가 부분 실패 시 좋은 데이터를 덮어씀~~ ✅ 2026-07-02 수정 완료

`fetchStats`가 버전 조회 확정 여부(`versionResolved`)를 반환하고 — 404는
"릴리스 없음"으로 확정, 403/5xx는 미확정 — 미확정이면 캐시된
`version`/`releasedAt`을 병합하도록 수정. 시뮬레이션 테스트로 검증함.

- 위치: `src/lib/github.ts:105-126`
- 증상: `fetchStats`가 `/repos` 호출만 성공하고 후속 `/releases/latest`·`/tags`
  호출이 실패하면 — 비인증 60req/시간 제한에서 흔한 상황 — `version`과
  `releasedAt`이 `undefined`인 결과를 반환한다. 이 결과가 null이 아니라서
  `getRepoStats`가 디스크 캐시의 멀쩡한 이전 `version`/`releasedAt`을 덮어쓰고,
  24시간 TTL 동안 "신선한" 것으로 서빙한다.
- 증거: 체크인된 `.aas-cache/github.json`의 51개 항목 중 35개가 `stars`만 있고
  `version`이 없음. 또한 `stalenessOf(undefined)`가 `'fresh'`를 반환해 릴리스
  노후 경고도 함께 사라진다.
- 수정 방향: 부분 실패 시 캐시된 `version`/`releasedAt`을 병합하거나,
  `version`이 없는 결과로는 기존 캐시 항목을 덮어쓰지 않도록 변경.

### 2. ~~README.md가 실제 코드와 크게 어긋남~~ ✅ 2026-07-02 수정 완료

전면 재작성: URL 스킴(`/stack/`·`/article/`) 교정, 세 컬렉션·글로서리·브라우즈
페이지 반영, 구조도 갱신, 상대 링크 예시 교정. 아래는 수정 전 기록.

- URL 스킴이 전부 옛날 것: `/stacks/` → 실제는 `/stack/`, `/blog/` → 실제는
  `/article/` — 구조도(README 71-72행)·툴 추가 안내(191-192행)·블로그
  섹션(161-162행) 모두 해당.
- 상대 링크 예시(180행)가 `../../stacks/langfuse/`인데 코드베이스 규약은
  `../../stack/<slug>/` — `astro.config.mjs:99` 주석 참조.
- 구조도에 이미 출시된 기능이 통째로 빠짐: `concepts` 컬렉션,
  `src/pages/concept/`·`glossary.astro`·`tags/`·`vendors/`·`categories/`,
  `src/data/`의 `glossary.mjs`·`category-tree.ts` 등, `src/lib/`의
  `concepts.ts`·`github.ts`·`project.ts` 등, 컴포넌트 약 30개.
- `content.config.ts` 설명(56행)이 "stacks·articles 두 컬렉션"이라고 하지만
  실제로는 `concepts`까지 세 개.
- 카테고리 안내(230-232행)가 평면 목록 기준이지만 실제는 `children`을 가진 트리.
- 수정 방향: 프로젝트 구조·URL·기능 목록 전면 재작성.

## MEDIUM — 고치면 좋음 ✅ 4건 모두 2026-07-02 수정 완료

- 3번: `innerHTML` → `textContent` 한 줄 교체. mermaid가 innerHTML을 읽어
  스스로 엔티티를 디코딩하므로 렌더 결과는 동일함을 빌드 산출물로 확인.
- 4번: `content.config.ts`가 `categoryMap`으로 검증 — 오타 주입 테스트에서
  "unknown category id" 메시지와 함께 빌드 실패 확인.
- 5번: `getAllVendors`에 빈 slug 가드 추가, `StackDetail`의 벤더 링크도 빈
  slug면 일반 텍스트로 렌더.
- 6번: `categories.ts`가 `buildTree` 재사용. rail 스크립트는 공유 모듈
  `src/lib/toc-rail-client.ts`로 통합 — 스택 페이지가 `<details>` 상태 저장과
  전체 접기 버튼을 얻고, TocRail은 숨김 헤딩 가드를 얻음. `resolveTool`은
  `toolResolver`(src/lib/stacks.ts)로, 파셋 파생은 `src/lib/facets.ts`로, 로고
  URL은 `src/lib/assets.ts`로 추출. 홈·카테고리 페이지 HTML 산출물이 리팩터링
  전과 동일함을 diff로 확인. LOW 목록의 "TocRail localStorage 미가드" 항목도
  이 과정에서 함께 해결됨.

아래는 수정 전 기록.

### 3. MermaidLoader 재렌더가 innerHTML로 XSS 패턴을 만듦

- 위치: `src/components/MermaidLoader.astro:56`
- 증상: `n.dataset.src`는 `textContent`에서 캡처되어 엔티티가 디코딩된
  상태인데, 재렌더 시 `n.innerHTML = n.dataset.src`로 되돌려 넣어 다이어그램
  라벨 속 `<img onerror=…>` 같은 마크업이 실제 DOM으로 살아난다. 서버 측
  remark 플러그인이 이스케이프해 둔 것을 이 왕복이 다시 푸는 구조다.
- 영향: 콘텐츠가 저자 작성 MDX뿐이라 실제 위험은 제한적이지만, 전형적인
  innerHTML-비이스케이프 패턴.
- 수정 방향: `n.innerHTML = …`를 `n.textContent = …`로 한 줄 교체.

### 4. 스택 category가 스키마에서 검증되지 않음

- 위치: `src/content.config.ts:26`
- 증상: `category: z.string()`이라 오타(예: `framework-orchestation`)가 빌드를
  통과하고, `getStacksByCategory`의 엄격한 필터에 걸려 해당 툴이 홈·카테고리
  페이지·브레드크럼에서 조용히 사라진다. articles/concepts에는 uncategorized
  폴백 버킷이 있는데 stacks에만 없다.
- 수정 방향: 카테고리 트리의 id 목록으로 `z.enum`(또는 refine) 검증 추가.

### 5. 비라틴 벤더명이 빈 slug와 깨진 라우트를 만듦

- 위치: `src/lib/stacks.ts:64-69`
- 증상: `slugifyName`이 `[a-z0-9]` 밖 문자를 전부 제거해 한글 벤더명은 slug가
  `''`가 되고, `getAllVendors`가 이를 걸러내지 않아 — `getStackAliases`는
  35행에서 걸러냄 — 빈 `[vendor]` 파라미터의 `/vendors/` 라우트가 생긴다.
  현재 벤더는 전부 라틴 문자라 잠복 상태지만 사이트 절반이 한국어라 현실적 지뢰.
- 수정 방향: 빈 slug 가드 추가, 장기적으로는 비라틴 slug 정책 결정.

### 6. 중복 구현 3건

- `src/data/categories.ts:365-409`가 `src/data/category-tree.ts`의 `buildTree`를
  쓰지 않고 `categoryMap`/`pathOf`/`childrenOf`/`descendantIds`를 복붙 유지 —
  `category-tree.ts` 자신의 주석은 "모든 분류 체계가 이걸 쓴다"고 주장.
- `StackDetail.astro:406-497`과 `TocRail.astro:65-123`의 스크롤스파이·rail 로직이
  갈라짐: 스택 페이지만 `<details>` 상태 저장과 전체 접기/펼치기 버튼이 없고,
  TocRail 쪽만 `offsetParent` 가드가 없다.
- `resolveTool()`이 `StackDetail.astro:101-113`과 `ArticleDetail.astro:62-74`에
  동일 복붙, 로고 URL/base 결합 로직이 `ToolAvatar`·`StackCard`·`StackDetail`
  세 곳에 존재, 파셋 파생 블록 약 30줄이 `Home.astro:28-60`과
  `CategoryIndex.astro:43-74`에 복붙.

## LOW — 여유 있을 때 ✅ 전 항목 2026-07-02 수정 완료

- CI 액션 3개를 커밋 SHA로 핀 — `# v4` 주석으로 태그 병기.
- `samples/*/requirements.txt` 36개 중 35개, 87줄에 차기 메이저 상한 추가 —
  예: `anthropic>=0.40,<1`. 이미 상한이 있던 3줄은 유지.
- `docker_1` Dockerfile이 Docker 정적 클라이언트를 아치별(x86_64·aarch64)
  sha256으로 검증 후 설치.
- 루트 `.gitignore`에 `!.env.sample` 추가 — `git check-ignore`로 확인.
- `DetailTabs`에 `role="tab"`·`aria-controls`·`role="tabpanel"`·
  `aria-labelledby` 추가.
- 죽은 코드 제거: `getArticlesByCategory`·`getConceptsByCategory`·`isLang`·
  `ListControls`의 `curatedLabel` 경로.
- sitemap `i18n` 옵션 추가 — 534쌍 페이지 전부에 en/ko hreflang 출력 확인.
- `formatStars`에 M 단위 추가 — 경계값(999,950 → "1.0M") 테스트 통과.
- `project.ts`가 바이너리 파일(확장자 + NUL 바이트 검사)을 파일 트리에서 제외.
- 프로젝트 이름 h1 추출을 정규식에서 markdown-it 토큰 기반으로 교체 —
  코드펜스 안 `#`이 이름이 될 수 없음.
- `CodeSamples`가 기본 버전(0)에서 `?v`를 제거 — 화면당 공유 URL 하나로 정규화.
- `ProjectViewer`의 pre-paint 스크립트가 rail 파일 버튼까지 갱신해 딥링크
  플래시 제거.

아래는 수정 전 기록.

### 수정 전 LOW 목록

- **CI 액션 태그 고정**: `deploy.yml`의 `checkout@v4`·`withastro/action@v3`·
  `deploy-pages@v4`가 커밋 SHA가 아닌 태그 고정 — `id-token: write` 권한이 있는
  워크플로라 SHA 핀 권장.
- **샘플 의존성 하한만 지정**: `samples/*/requirements.txt`가 전부 `>=` 형식에
  락파일 없음 — 메이저 릴리스 때 샘플 빌드가 깨질 수 있음.
- **`samples/docker_1/Dockerfile:17`**: Docker 정적 클라이언트를 체크섬 검증
  없이 받아 `/usr/local/bin`에 설치.
- **`.gitignore:23`의 `.env.*` 패턴**: 새 샘플 폴더의 `.env.sample`이 조용히
  누락됨 — 기존 샘플은 폴더별 `.gitignore`의 `!.env.sample`로 우회 중이니 루트에
  `!.env.sample` 추가 권장.
- **탭 접근성**: `DetailTabs.astro:15-40`의 `role="tablist"` 안이 일반 버튼 —
  `role="tab"`·`aria-controls`·`role="tabpanel"` 부재.
- **죽은 코드**: `getArticlesByCategory`·`getConceptsByCategory`(`src/lib/`),
  `isLang`(`src/i18n/ui.ts`), `ListControls`의 `curatedLabel` 경로.
- **sitemap에 hreflang 없음**: `astro.config.mjs:196`의 `sitemap()`에 `i18n`
  옵션 미지정 — en/ko 쌍이 검색엔진에 연결되지 않음.
- **`formatStars`에 백만 단위 없음**: `src/lib/github.ts:160-163` — 100만 스타가
  "1000.0k"로 표시.
- **프로젝트 뷰어가 바이너리를 텍스트로 렌더**: `src/lib/project.ts:136-142` —
  확장자/바이너리 필터 없음.
- **README h1 추출이 코드펜스 미인식**: `src/lib/project.ts:222` — 펜스 안
  `# comment`가 프로젝트 이름이 될 수 있음.
- **`CodeSamples.astro:132-137`**: 주석은 "v=0이면 ?v 제거"라지만 무조건
  `?v=0`을 기록 — 같은 화면에 공유 URL이 두 가지 생김.
- **`TocRail.astro:103`**: `localStorage.getItem`이 try/catch 없이 호출 —
  스토리지가 막힌 브라우저에서 reveal 저장·전체 접기 버튼이 통째로 죽음.
- **`ProjectViewer.astro:220-228`**: `?file=` 딥링크 시 2xl 이상 화면의 rail
  파일 목록이 첫 파일로 잠깐 잘못 하이라이트되는 pre-paint 플래시.
