# Firecrawl web-scraping agent — a docs page to Markdown

A ~45-line [LangGraph](https://github.com/langchain-ai/langgraph) ReAct agent
with a single `scrape` tool backed by [Firecrawl](https://firecrawl.dev). Give
it a task that needs a page's contents — "read this docs page and summarize it"
— and it fetches the page as clean Markdown, reads it, and answers. The model is
routed through LiteLLM, so the **same code** works with **Anthropic Claude**,
**OpenAI**, or **Google AI Studio (Gemini)** — change `MODEL` in `.env`, never
the code.

## Configure

```bash
cd samples/firecrawl_1
cp .env.sample .env
# edit .env: set FIRECRAWL_API_KEY, MODEL, and the matching provider key
```

`FIRECRAWL_API_KEY` is always required — it's the scrape tool. Then `MODEL`
picks the provider:

| Provider          | `MODEL` example           | Key in `.env`       |
| ----------------- | ------------------------- | ------------------- |
| Anthropic Claude  | `claude-opus-4-8`         | `ANTHROPIC_API_KEY` |
| OpenAI            | `gpt-4o`                  | `OPENAI_API_KEY`    |
| Google AI Studio  | `gemini/gemini-2.5-flash` | `GEMINI_API_KEY`    |

`.env` is gitignored — only `.env.sample` is committed.

## Run with Docker

```bash
cd samples/firecrawl_1
docker build -t aas-firecrawl .
docker run --rm --env-file .env aas-firecrawl \
  "https://docs.firecrawl.dev 를 읽고 핵심 기능 3가지만 요약해줘"
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
cd samples/firecrawl_1
docker build -t aas-firecrawl .
docker logs -f "$(docker run -d --env-file .env aas-firecrawl \
  "https://docs.firecrawl.dev 를 읽고 핵심 기능 3가지만 요약해줘")"
```

## Run locally

```bash
cd samples/firecrawl_1
pip install -r requirements.txt
python app.py "https://docs.firecrawl.dev 를 읽고 핵심 기능 3가지만 요약해줘"
```

`python-dotenv` loads `.env` automatically. Get the Firecrawl key from
[Firecrawl](https://firecrawl.dev), and model keys from
[Anthropic](https://console.anthropic.com/),
[OpenAI](https://platform.openai.com/api-keys), or
[Google AI Studio](https://aistudio.google.com/apikey).

## How it works

Search finds *where* to look; scraping reads the page in. The loop is the spine,
the tool is the reader.

1. The model reads the task and the `scrape` tool's schema.
2. It calls `scrape` with the URL it needs to read.
3. Firecrawl fetches the page and returns clean Markdown.
4. The model reads that Markdown and writes the answer.

Without the tool the model can't see past a link; with it, the page's real
contents go straight into its reasoning.

## Example run

> Output varies by model and run — LLMs are non-deterministic, so the exact
> wording (and an agent's steps) differ each time. Below is one run with
> `gemini/gemini-2.5-flash` (the answer is Korean because the question is).

```text
Firecrawl의 핵심 기능 3가지는 다음과 같습니다:

1. **웹 검색 (Web Search):** 웹에서 정보를 검색하는 기능입니다.
2. **스크래핑 (Scraping):** 웹 페이지에서 데이터를 추출하는 기능입니다.
3. **에이전트 (Agent):** 웹에서 데이터를 수집하는 데 사용되는 에이전트 기능입니다.
```
