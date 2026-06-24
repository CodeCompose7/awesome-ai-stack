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

## Line breaks inside a paragraph: two trailing spaces

To make sentences render on their **own lines without the vertical gap of a new
paragraph**, end each line — except the last — with **two trailing spaces**.
That is Markdown's hard line break and renders as `<br>`:

```markdown
LangGraph는 에이전트를 **노드들의 그래프**로 모델링하고 엣지로 연결합니다.␣␣
각 노드는 하나의 단계(모델 호출, 도구 실행, 메모리 갱신)이고, …␣␣
상태가 명시적이기 때문에 평범한 while 루프로는 표현하기 어려운 …
```

(`␣␣` marks the two trailing spaces; they are literal spaces in the file, not a
symbol.)

Contrast the alternatives:

- A **blank line** instead starts a new paragraph, which adds vertical spacing —
  use that when you want the sentences visually separated, not tightly stacked.
- With **neither**, soft-wrapped source lines collapse into a single rendered
  line, so the break you see in the source disappears on the page.

Caveats:

- The two spaces are **invisible**, and many editors/formatters strip trailing
  whitespace on save. If a break vanishes on the rendered page, check the two
  spaces survived — `cat -A` shows each line ending in two spaces then `$`.
- This is the one case where the ~90-column wrap rule below does **not** apply: a
  line laid out for a deliberate break stays on its own line even if it runs long.

## General

- Tag every fenced code block with its language (` ```bash `, ` ```python `,
  ` ```mermaid `).
- Keep commands copy-pasteable and runnable exactly as shown.
- Wrap prose at a reasonable width (~90 columns) so diffs stay readable.
