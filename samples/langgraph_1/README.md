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

> **Blank output?** `litellm` pulls in a large dependency stack (`openai`,
> `tiktoken`, …); on a memory-starved Docker VM the container can be killed
> mid-import and print nothing. Give Docker ≥4 GB (Docker Desktop → Settings →
> Resources → Memory), or run locally (below).

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
