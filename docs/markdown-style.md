# Markdown style guide

Conventions for Markdown in this repo — docs and the sample `README.md` /
`README.<lang>.md` files. Written so any contributor, human or AI, can follow
them.

## Korean prose: avoid `).` (closing paren then period)

Don't end a Korean sentence with a parenthetical aside, which leaves a closing
parenthesis directly followed by a period — the `).` sequence. It reads
awkwardly. Rephrase instead: split into two sentences, fold the aside into the
main clause, or use an em dash.

- ❌ `… 강제 종료되기 때문입니다(OOM이 아니며, … 피할 수 없습니다).`
- ✅ `… 강제 종료되기 때문입니다. (OOM이 아니며, … 피할 수 없습니다)`
- ✅ `… 강제 종료되기 때문인데, OOM이 아니고 … 피할 수 없습니다.`
- ✅ `… 강제 종료되기 때문입니다. OOM이 아니고, … 피할 수 없습니다.`

A parenthesis in the middle of a sentence is fine — only the sentence-final
`).` is the problem:

- ✅ `dev container(Docker-outside-of-Docker)에서는 …` — `)에` follows, not `).`

**Exception — Markdown syntax.** A link or image that ends a sentence keeps its
period; that trailing `).` is part of Markdown, not prose, and must stay:

- ✅ `… 키는 [Google AI Studio](https://aistudio.google.com/apikey).`

The rule is only about prose parentheses `( … )`, never about `](url)` / `](path)`.

## Korean: parenthesize a mid-sentence aside, don't em-dash it

When a noun (or a short noun list) is inserted *inside* a sentence that flows
right past it — the next word is a particle like `으로`, `를`, `에서` — wrap the
aside in parentheses. An em dash detaches the particle and reads awkwardly,
because Korean glues the particle to the noun, not to a floating dash.

- ❌ `LLM을 스캐폴딩 — 제어 루프·도구·샌드박스·가드레일·평가 — 으로 감싸 …` — `으로`
  is stranded after the dash
- ✅ `LLM을 스캐폴딩(제어 루프·도구·샌드박스·가드레일·평가)으로 감싸 …` — `)으로`
  keeps the particle attached

This stays consistent with the `).` rule above: the parenthesis is mid-sentence
(`)으로` follows, not `).`), so it is fine. Em dashes are still the right tool
for a *trailing* aside the sentence does **not** continue past (e.g. `… 한 겹씩
더합니다 — 위험이 있는 곳에만`).

## Korean: no trailing period after a noun-ending fragment

A list item, caption, or table cell that ends in a **noun / noun phrase** — a
fragment, not a finished sentence — takes **no trailing period**. A line that
ends in a finite predicate (`…다.`, `…요.`, `…니다.`, `…니까요.`) is a full
sentence and **keeps** its period, even inside a list. The test: does the line
end in a predicate? Yes → period; bare noun → no period.

```markdown
- **루프 + 모델**로 시작                    ← 명사로 끝남 → 마침표 없음
- 에이전트가 코드를 돌리면 **샌드박스**       ← 명사로 끝남 → 마침표 없음
- 반복을 시작하면 **평가 + 트레이싱** — 측정할 수 없는 건 개선할 수 없으니까요.  ← 완결 문장 → 마침표 유지
```

This is about how the line *ends*, so a complete sentence whose main predicate
sits mid-line (e.g. `… 짜는 일입니다 — 제어 루프, 도구, 측정.`) is still a
sentence and keeps the period.

**English keeps sentence periods.** English list items that are complete
sentences — including imperatives — keep their period; only true noun-phrase
fragments drop it. So a Korean item and its English counterpart may differ:
`- **루프 + 모델**로 시작` (fragment, no period) vs `- Start with the **loop +
model**.` (imperative sentence, period). That asymmetry is expected.

## Line breaks inside a paragraph: one space soft, two spaces hard

Inside a single paragraph (no blank line between the lines), the number of
**trailing spaces** on a line decides what the break does on the page. Applies to
Korean and English prose alike:

- **Two trailing spaces** → a Markdown hard break (`<br>`). The next line renders
  on its **own line**, with no paragraph gap. Use it to deliberately stack
  sentences.
- **One trailing space** → a soft wrap. The source breaks for readability — e.g.
  one sentence per line, which keeps diffs clean — but the lines **collapse into
  one rendered line**. The break you see in the file is invisible on the page.
- A **blank line** → a new paragraph, which adds vertical spacing.

```markdown
샌드박스는 신뢰할 수 없는 코드를 일회용 환경에서 실행합니다.␣            ← 1 space: 소스만 줄바꿈, 뷰는 한 줄로 이어짐
에이전트는 모델이 짠 코드처럼 무엇을 할지 모를 것을 돌립니다.

검색은 *어디를* 볼지 찾습니다.␣␣                                       ← 2 spaces: 뷰에서도 줄이 바뀜
스크래핑은 *그 페이지를* 읽어 옵니다.
```

(`␣` marks one trailing space and `␣␣` two; they are literal spaces in the file,
not symbols.)

So when you want a paragraph to keep flowing but still wrap the source one
sentence per line, end each line with **one** trailing space. When you want the
sentences to actually render stacked, use **two**.

Caveats:

- The trailing spaces are **invisible**, and many editors/formatters strip
  trailing whitespace on save (which silently turns a one-space soft wrap into a
  plain newline — same render — and a two-space hard break into a collapsed line).
  This is why [`.prettierignore`](../.prettierignore) keeps Markdown out of
  Prettier. `cat -A` shows each line ending in its spaces then `$`.
- This is the one case where the ~90-column wrap rule below does **not** apply: a
  line laid out for a deliberate break stays on its own line even if it runs long.

## Emphasis: use `*` for italic and `**` for bold, not `_`

Use asterisks for emphasis — `*italic*` and `**bold**` — never the underscore
forms `_italic_` / `__bold__`. Asterisks work consistently mid-word and across
scripts (including Korean, where `_…_` between non-space characters often fails
to render), and keeping one style makes the source uniform.

- ❌ `모델 _주위에_ 스캐폴딩을 짭니다`
- ✅ `모델 *주위에* 스캐폴딩을 짭니다`

**Close emphasis at a clean boundary — don't let it end on `)` against CJK.**
A closing `**`/`*` right after a `)` and immediately followed by a CJK
character (no space) is often *not* recognized as a closing delimiter, so the
markers render literally. Keep the emphasis on the core term and push any
parenthetical or particle outside it.

- ❌ `**function calling(도구 호출)**입니다` — renders a literal `**`
- ✅ `**function calling**(도구 호출)입니다`

## Heading anchors: give each heading an explicit English id

Headings in concept/article MDX carry a stable, language-independent id so the
**same** anchor works on the `en` and `ko` versions of a page, and so an external
link to a section survives the heading wording changing. Write it as a trailing
`{#id}` — and because MDX parses `{…}` as an expression, **escape the opening
brace**: `\{#id}`.

- ✅ `## 무엇인가 \{#what-it-is}` / `## What it is \{#what-it-is}` — same id both locales
- The id (lowercase, hyphenated, English) is stripped from the visible heading
  and used verbatim; a remark plugin sets it and rehype-slug won't override it.
- In-page anchor links then target that id: `[웹 검색](#web-search)`.
- A heading with no `\{#id}` falls back to an auto-slug of its text (unstable,
  per-locale) — so add the id when authoring.

## General

- Tag every fenced code block with its language (` ```bash `, ` ```python `,
  ` ```mermaid `).
- Keep commands copy-pasteable and runnable exactly as shown.
- Wrap prose at a reasonable width (~90 columns) so diffs stay readable.
