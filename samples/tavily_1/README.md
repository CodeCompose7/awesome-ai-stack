# Tavily web-search agent — asking today's FX rate

A ~40-line [LangGraph](https://github.com/langchain-ai/langgraph) ReAct agent
with a single `web_search` tool backed by [Tavily](https://tavily.com). Ask it
something only current data can answer — "today's USD→KRW rate" — and it
searches the web, reads the fresh results, and answers with the number and its
sources. The model is routed through LiteLLM, so the same code runs on Claude,
OpenAI, or Gemini — change `MODEL` in `.env`.

## Setup

```bash
cd samples/tavily_1
cp .env.sample .env
# edit .env: set TAVILY_API_KEY, MODEL, and the matching provider key
```

`TAVILY_API_KEY` is always required — it's the search tool. Then pick a model:

| Provider | `MODEL` example | key in `.env` |
| --- | --- | --- |
| Anthropic Claude | `claude-opus-4-8` | `ANTHROPIC_API_KEY` |
| OpenAI | `gpt-4o` | `OPENAI_API_KEY` |
| Google AI Studio | `gemini/gemini-2.5-flash` | `GEMINI_API_KEY` |

## Run with Docker

```bash
docker build -t aas-tavily .
docker run --rm --env-file .env aas-tavily "오늘 USD/KRW 환율은?"
```

## How it works

The loop is the spine; the tool is what reaches the live web.

1. The model reads the question and the `web_search` tool's schema.
2. Needing current data, it calls `web_search` with a query.
3. Tavily returns a short answer plus source links.
4. The model folds that into its reasoning and writes the final answer.

Without the tool the model can only guess from stale training data; with it,
the answer is grounded in today's web.

## Example

```text
$ docker run --rm --env-file .env aas-tavily "오늘 USD/KRW 환율은?"
오늘 USD/KRW 환율은 약 1,370원입니다. (출처: ...)
```
