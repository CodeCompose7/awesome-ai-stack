# LangSmith — trace a Claude call (hosted)

A tiny [LangSmith](https://www.langchain.com/langsmith) demo: `@traceable` wraps
a Claude call so each run shows up in LangSmith, then the app reads the run back
via the SDK and prints it — proving the round trip, not just that the call
didn't error. LangSmith is a **hosted SaaS**, so this needs your own API key
(there's no free self-host).

## Configure

```bash
cd samples/langsmith_1
cp .env.sample .env
# edit .env: set LANGSMITH_API_KEY and ANTHROPIC_API_KEY
```

| Variable            | What it is                                                      |
| ------------------- | -------------------------------------------------------------- |
| `LANGSMITH_API_KEY` | from [smith.langchain.com](https://smith.langchain.com) → Settings → API Keys |
| `LANGSMITH_TRACING` | `true` to send traces                                          |
| `LANGSMITH_PROJECT` | project name traces land in                                    |
| `ANTHROPIC_API_KEY` | key for the Claude call being traced                           |

EU accounts also set `LANGSMITH_ENDPOINT=https://eu.api.smith.langchain.com`.
`.env` is gitignored — only `.env.sample` is committed.

## Run with Docker

```bash
cd samples/langsmith_1
docker build -t aas-langsmith .
docker run --rm --env-file .env aas-langsmith "How do I reset my password?"
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
cd samples/langsmith_1
docker build -t aas-langsmith .
docker logs -f "$(docker run -d --env-file .env aas-langsmith \
  "How do I reset my password?")"
```

## Run locally

```bash
cd samples/langsmith_1
pip install -r requirements.txt
python app.py "How do I reset my password?"
```

`python-dotenv` loads `.env` automatically.

---

## Example run

> Output varies by model and run — LLMs are non-deterministic, so the model's
> wording differs each time (the trace round-trip itself is what's being shown).
> Below is one run with `claude-opus-4-8`.

```text
model says: I'd be happy to help you reset your password! However, the exact
steps depend on which service or account you're trying to access. ...

reading the run back from LangSmith ...
  run id:  019eff2d-6596-7461-80d0-25388eb56ec4
  name:    plan
  inputs:  {'question': 'How do I reset my password?'}
  outputs: {'output': "I'd be happy to help you reset your password! ..."}
  url:     https://smith.langchain.com/o/<org-id>/projects/p/<project-id>/r/019eff2d-...
```
