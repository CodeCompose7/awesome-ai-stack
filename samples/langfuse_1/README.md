# Langfuse — trace an LLM call (self-hosted)

A tiny [Langfuse](https://langfuse.com) demo: it wraps a Claude call in a
Langfuse **generation span**, sends it to a **self-hosted** Langfuse, then reads
the trace back from the API to prove the round trip (not just "it didn't
error"). The bundled docker-compose starts the whole Langfuse stack and
bootstraps a project with fixed API keys via `LANGFUSE_INIT_*`, so there's
nothing to click through.

> **Heavy stack.** Langfuse v3 needs Postgres + ClickHouse + Redis + MinIO +
> web + worker. The first boot pulls several images and runs DB migrations, so
> give it a few minutes.

## Configure

```bash
cd samples/langfuse_1
cp .env.sample .env
# edit .env: set ANTHROPIC_API_KEY (the only secret you provide)
```

The Langfuse API keys are bootstrapped by compose — you only supply the model
key for the call being traced. `.env` is gitignored — only `.env.sample` is
committed.

## Run with Docker Compose (bundled Langfuse)

```bash
cd samples/langfuse_1
docker compose up --build
```

The app waits for Langfuse to finish migrating, makes the call, and prints the
trace it read back. Browse it in the UI at <http://localhost:3000> (log in with
`demo@example.com` / `demodemodemo`). Tear the stack down and wipe its volumes
when done:

```bash
docker compose down -v
```

## Run with Docker Compose (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the attached `docker compose up` may print nothing for the app even though it
ran — the live attached stream drops output over the VM boundary. Run detached
and read it back from the logs:

```bash
cd samples/langfuse_1
docker compose up --build -d
docker compose logs -f app
docker compose down -v
```

## Notes

- The app talks to the bundled Langfuse at `http://langfuse-web:3000` with the
  bootstrapped keys. To use **Langfuse Cloud** instead, set `LANGFUSE_HOST`,
  `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY` and skip the compose stack.
- The infra secrets in `docker-compose.yml` are demo defaults — fine for a local
  throwaway stack, not for production.

---

## Example run

> Output varies by model and run — LLMs are non-deterministic, so the model's
> wording differs each time (the trace round-trip itself is what's being shown).
> Below is one run with `claude-opus-4-8`.

```text
waiting for Langfuse at http://langfuse-web:3000 ...
model says: Langfuse is an open-source observability and analytics platform for
LLM applications that helps developers trace, monitor, debug, and evaluate their
AI-powered features.

reading the trace back from Langfuse ...
  trace id: 3a0fc910ed901d00ac418161a63398a2
  name:     plan
  input:    Summarize what Langfuse does in one sentence.
  output:   Langfuse is an open-source observability and analytics platform ...
  UI:       http://langfuse-web:3000/project/demo-project/traces/3a0fc910ed901d00ac418161a63398a2
```
