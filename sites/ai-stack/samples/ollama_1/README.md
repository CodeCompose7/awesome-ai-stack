# Ollama — a local LLM call via LiteLLM

A tiny script that calls a model running in a local [Ollama](https://ollama.com)
server through LiteLLM — no API key, no cloud. Because it goes through LiteLLM,
the same code runs against a cloud model by changing `MODEL`.

## Configure

```bash
cd samples/ollama_1
cp .env.sample .env
```

First pull the model on the host — `ollama pull qwen3.5:9b` (or `ollama run
qwen3.5:9b`). No API key is needed. `.env` sets `MODEL` and `OLLAMA_API_BASE`;
in a devcontainer with DooD the container reaches the host's Ollama at
`http://host.docker.internal:11434` (already the default in `.env.sample`).

> Tool calling needs the `ollama_chat/` prefix (Ollama's chat endpoint), not
> `ollama/` — and a tool-capable model.

## Run with Docker

```bash
cd samples/ollama_1
docker build -t aas-ollama .
docker run --rm --env-file .env aas-ollama "Summarize Ollama in one line."
```

## Run with Docker (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the foreground `docker run` above often prints nothing and exits 0 — but the run
itself succeeds. The script runs to completion and Docker captures all of its
output; only the live **attached** stream drops it over the VM boundary. Run
**detached** and follow the logs instead:

```bash
cd samples/ollama_1
docker build -t aas-ollama .
docker logs -f "$(docker run -d --env-file .env aas-ollama \
  "Summarize Ollama in one line.")"
```

## Run locally

```bash
cd samples/ollama_1
pip install -r requirements.txt
# point at your local Ollama (no Docker): http://localhost:11434
OLLAMA_API_BASE=http://localhost:11434 python app.py "Summarize Ollama in one line."
```

---

## Example run

> Output varies by model and run — LLMs are non-deterministic, so the wording
> differs each time. Below is one run with `ollama_chat/qwen3.5:9b`.

```text
Ollama allows users to easily run open-source large language models locally on
their own devices, enabling private and offline access to AI without relying on
external servers or internet connectivity.
```
