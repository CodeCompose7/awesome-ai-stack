# Tavily web-search agent — asking today's FX rate

A ~40-line [LangGraph](https://github.com/langchain-ai/langgraph) ReAct agent
with a single `web_search` tool backed by [Tavily](https://tavily.com). Ask it
something only current data can answer — "today's USD→KRW rate" — and it
searches the web, reads the fresh results, and answers with the number and its
sources. The model is routed through LiteLLM, so the **same code** works with
**Anthropic Claude**, **OpenAI**, or **Google AI Studio (Gemini)** — change
`MODEL` in `.env`, never the code.

## Configure

```bash
cd samples/tavily_1
cp .env.sample .env
# edit .env: set TAVILY_API_KEY, MODEL, and the matching provider key
```

`TAVILY_API_KEY` is always required — it's the search tool. Then `MODEL` picks
the provider:

| Provider          | `MODEL` example           | Key in `.env`       |
| ----------------- | ------------------------- | ------------------- |
| Anthropic Claude  | `claude-opus-4-8`         | `ANTHROPIC_API_KEY` |
| OpenAI            | `gpt-4o`                  | `OPENAI_API_KEY`    |
| Google AI Studio  | `gemini/gemini-2.5-flash` | `GEMINI_API_KEY`    |

`.env` is gitignored — only `.env.sample` is committed.

## Run with Docker

```bash
cd samples/tavily_1
docker build -t aas-tavily .
docker run --rm --env-file .env aas-tavily "오늘 USD/KRW 환율은?"
```

## Run with Docker (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the foreground `docker run` above often prints nothing and exits 0 — but the run
itself succeeds. The script runs to completion and Docker captures all of its
output; only the live **attached** stream drops it over the VM boundary. You can
confirm this: `docker logs` on the same container shows the full output, the
container exits 0, and it is **not** an OOM. Run **detached** and follow the logs
instead:

```bash
cd samples/tavily_1
docker build -t aas-tavily .
docker logs -f "$(docker run -d --env-file .env aas-tavily \
  "오늘 USD/KRW 환율은?")"
```

## Run locally

```bash
cd samples/tavily_1
pip install -r requirements.txt
python app.py "오늘 USD/KRW 환율은?"
```

`python-dotenv` loads `.env` automatically. Get the Tavily key from
[Tavily](https://tavily.com), and model keys from
[Anthropic](https://console.anthropic.com/),
[OpenAI](https://platform.openai.com/api-keys), or
[Google AI Studio](https://aistudio.google.com/apikey).

## How it works

The loop is the spine; the tool is what reaches the live web.

1. The model reads the question and the `web_search` tool's schema.
2. Needing current data, it calls `web_search` with a query.
3. Tavily returns a short answer plus source links.
4. The model folds that into its reasoning and writes the final answer.

Without the tool the model can only guess from stale training data; with it,
the answer is grounded in today's web.

---

## Example run

> Output varies by model and run — LLMs are non-deterministic, so the exact
> wording (and an agent's steps) differ each time. Below is one run with
> `gemini/gemini-2.5-flash` (the answer is Korean because the question is).

```text
오늘 USD/KRW 환율은 약 1,543.45원입니다. 이 환율은 시장 상황에 따라 변동될 수 있으므로, 가장 최신 정보는 금융 뉴스 또는 환율 웹사이트에서 확인하시는 것이 좋습니다.
```
