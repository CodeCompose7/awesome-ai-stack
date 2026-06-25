# mini-SWE-agent — a shell-only coding agent

A minimal [mini-SWE-agent](https://mini-swe-agent.com/) binding: a `DefaultAgent`
drives a `LocalEnvironment` with a text-based LiteLLM model. It reads a task,
runs one bash command at a time, observes the output, and loops until it
submits. The model is routed through [LiteLLM](https://docs.litellm.ai/), so the
same code works with **Anthropic Claude**, **OpenAI**, or **Google AI Studio
(Gemini)** — just change `MODEL` in `.env`.

> **Use a capable model** (e.g. `claude-opus-4-8`, `gpt-4o`). The agent protocol
> — reply with one `mswea_bash_command` fence, then submit — is unreliable with
> small models, which tend to loop or mis-format.

## Configure

```bash
cd samples/mini-swe-agent_1
cp .env.sample .env
# edit .env: set MODEL and the matching provider key
```

`MODEL` picks the provider:

| Provider          | `MODEL` example           | Key in `.env`       |
| ----------------- | ------------------------- | ------------------- |
| Anthropic Claude  | `claude-opus-4-8`         | `ANTHROPIC_API_KEY` |
| OpenAI            | `gpt-4o`                  | `OPENAI_API_KEY`    |
| Google AI Studio  | `gemini/gemini-2.5-flash` | `GEMINI_API_KEY`    |
| Ollama (local)    | `ollama/qwen3.5:9b`       | `OLLAMA_API_BASE`   |

`.env` is gitignored — only `.env.sample` is committed.

**Ollama (local models):** first pull the model on the host —
`ollama pull qwen3.5:9b` (or `ollama run qwen3.5:9b`). Then set
`MODEL=ollama/qwen3.5:9b` and point `OLLAMA_API_BASE` at the server — no API key
needed. In a devcontainer with DooD the container reaches the host's Ollama at
`http://host.docker.internal:11434`; running locally use
`http://localhost:11434`.

## Run with Docker

```bash
cd samples/mini-swe-agent_1
docker build -t aas-mini-swe-agent .
docker run --rm --env-file .env aas-mini-swe-agent \
  "Print the result of 2 + 2 using a single shell command, then submit."
```

## Run with Docker (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the foreground `docker run` above often prints nothing and exits 0 — but the run
itself succeeds. The agent runs to completion and Docker captures all of its
output; only the live **attached** stream drops it over the VM boundary. You can
confirm this: `docker logs` on the same container shows the full output, the
container exits 0, and it is **not** an OOM. Run **detached** and follow the logs
instead:

```bash
cd samples/mini-swe-agent_1
docker build -t aas-mini-swe-agent .
docker logs -f "$(docker run -d --env-file .env aas-mini-swe-agent \
  "Print the result of 2 + 2 using a single shell command, then submit.")"
```

## Run locally

```bash
cd samples/mini-swe-agent_1
pip install -r requirements.txt
python app.py "Print the result of 2 + 2 using a single shell command, then submit."
```

`python-dotenv` loads `.env` automatically. Get keys from
[Anthropic](https://console.anthropic.com/),
[OpenAI](https://platform.openai.com/api-keys), or
[Google AI Studio](https://aistudio.google.com/apikey).
