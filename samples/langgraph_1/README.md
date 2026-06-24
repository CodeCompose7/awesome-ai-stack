# LangGraph — minimal tool-using agent

A ~50-line [LangGraph](https://www.langchain.com/langgraph) ReAct agent: it calls
an LLM with two tools (`multiply`, `is_prime`) and runs the reasoning loop until
it can answer. The model is routed through [LiteLLM](https://docs.litellm.ai/),
so the same code works with **Anthropic Claude**, **OpenAI**, or
**Google AI Studio (Gemini)** — just change `MODEL` in `.env`.

## Configure

```bash
cd samples/langgraph_1
cp .env.sample .env
# edit .env: set MODEL and the matching provider key
```

`MODEL` picks the provider:

| Provider          | `MODEL` example           | Key in `.env`       |
| ----------------- | ------------------------- | ------------------- |
| Anthropic Claude  | `claude-opus-4-8`         | `ANTHROPIC_API_KEY` |
| OpenAI            | `gpt-4o`                  | `OPENAI_API_KEY`    |
| Google AI Studio  | `gemini/gemini-2.5-flash` | `GEMINI_API_KEY`    |

`.env` is gitignored — only `.env.sample` is committed.

## Run with Docker

```bash
cd samples/langgraph_1
docker build -t aas-langgraph .
docker run --rm --env-file .env aas-langgraph \
  "What is 24 * 7, and is the result prime?"
```

## Run with Docker (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the foreground `docker run` above prints nothing and exits 0 — the process is
hard-killed as `litellm` is imported while a client is attached to the
container's stdio (it is **not** an OOM, and no flag, `setsid`, or in-container
redirect avoids it). Run **detached** and follow the logs instead:

```bash
cd samples/langgraph_1
docker build -t aas-langgraph .
docker logs -f "$(docker run -d --env-file .env aas-langgraph \
  "What is 24 * 7, and is the result prime?")"
```

## Run locally

```bash
cd samples/langgraph_1
pip install -r requirements.txt
python app.py "What is 24 * 7, and is the result prime?"
```

`python-dotenv` loads `.env` automatically. Get keys from
[Anthropic](https://console.anthropic.com/),
[OpenAI](https://platform.openai.com/api-keys), or
[Google AI Studio](https://aistudio.google.com/apikey).
