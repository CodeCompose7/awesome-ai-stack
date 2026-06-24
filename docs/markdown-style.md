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

## General

- Tag every fenced code block with its language (` ```bash `, ` ```python `,
  ` ```mermaid `).
- Keep commands copy-pasteable and runnable exactly as shown.
- Wrap prose at a reasonable width (~90 columns) so diffs stay readable.
