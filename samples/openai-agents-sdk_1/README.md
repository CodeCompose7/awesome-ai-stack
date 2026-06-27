# OpenAI Agents SDK — implementation sample

A tiny [OpenAI Agents SDK](https://openai.github.io/openai-agents-python) sample:
it defines an agent and runs your prompt.

## Configure

```bash
cd samples/openai-agents-sdk_1
cp .env.sample .env
# edit .env: set OPENAI_API_KEY (and optionally MODEL)
```

## Run with Docker

```bash
cd samples/openai-agents-sdk_1
docker build -t aas-openai-agents .
docker run --rm --env-file .env aas-openai-agents "Summarize AI agents in one sentence."
```

## Run with Docker (in a devcontainer with DooD)

The foreground `docker run` may print nothing under Docker-outside-of-Docker —
run detached and follow the logs:

```bash
docker logs -f "$(docker run -d --env-file .env aas-openai-agents "Summarize AI agents in one sentence.")"
```

## Run locally

```bash
cd samples/openai-agents-sdk_1
pip install -r requirements.txt
python app.py "Summarize AI agents in one sentence."
```

---

## Example run

> Output varies by model and run — LLMs are non-deterministic. One run with
> `gpt-4o-mini`:

```text
An AI agent is an autonomous system that perceives its environment, makes decisions based on that information, and acts to achieve specific goals.
```
