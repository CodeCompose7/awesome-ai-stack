# Anthropic Claude — a tool-using agent turn

A tiny agent loop built on the official
[Anthropic SDK](https://docs.anthropic.com/): Claude is given one tool
(`get_weather`), decides to call it, and the script feeds the result back as a
`tool_result` — looping until Claude writes a final answer. That loop is the
core agentic pattern.

## Configure

```bash
cd samples/anthropic-claude_1
cp .env.sample .env
# edit .env: set ANTHROPIC_API_KEY (and optionally MODEL)
```

Get a key at [console.anthropic.com](https://console.anthropic.com/). `MODEL`
defaults to `claude-opus-4-8`; see the
[model list](https://docs.anthropic.com/en/docs/about-claude/models).

`.env` is gitignored — only `.env.sample` is committed.

## Run with Docker

```bash
cd samples/anthropic-claude_1
docker build -t aas-anthropic-claude .
docker run --rm --env-file .env aas-anthropic-claude "What should I wear in Seoul today?"
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
cd samples/anthropic-claude_1
docker build -t aas-anthropic-claude .
docker logs -f "$(docker run -d --env-file .env aas-anthropic-claude \
  "What should I wear in Seoul today?")"
```

## Run locally

```bash
cd samples/anthropic-claude_1
pip install -r requirements.txt
python app.py "What should I wear in Seoul today?"
```

`python-dotenv` loads `.env` automatically.
