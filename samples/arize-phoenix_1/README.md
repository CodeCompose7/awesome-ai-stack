# Arize Phoenix — trace an LLM call (self-hosted)

A tiny [Phoenix](https://arize.com/phoenix/) demo: the bundled docker-compose
runs a Phoenix server, and the app registers OpenTelemetry tracing, makes one
**LiteLLM** call (auto-instrumented), then queries Phoenix for the spans — proving
the round trip, not just that the call didn't error.

## Configure

```bash
cd samples/arize-phoenix_1
cp .env.sample .env
# edit .env: set ANTHROPIC_API_KEY (for the call being traced)
```

Phoenix itself needs no key; you only provide the model key. `.env` is
gitignored — only `.env.sample` is committed.

## Run with Docker Compose

```bash
cd samples/arize-phoenix_1
docker compose up --build
```

The app waits for Phoenix, makes the traced call, and prints the spans it read
back. Browse them in the UI at <http://localhost:6006>. Tear down when done:

```bash
docker compose down -v
```

## Run with Docker Compose (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the attached `docker compose up` may print nothing for the app even though it
ran — the live attached stream drops output over the VM boundary. Run detached
and read it back from the logs:

```bash
cd samples/arize-phoenix_1
docker compose up --build -d
docker compose logs -f app
docker compose down -v
```

## Notes

- The traced call goes through LiteLLM, so `MODEL` (in `docker-compose.yml`) can
  be any provider — change it and set the matching key.
- To trace into **Phoenix Cloud** instead, point `PHOENIX_COLLECTOR_ENDPOINT` at
  it and skip the bundled server.

---

## Example run

> The model's wording varies by run (LLMs are non-deterministic); what's shown
> is the trace round-trip. Below is one run with `anthropic/claude-opus-4-8`.

```text
model says: Arize Phoenix is an open-source observability and evaluation platform
for tracing, monitoring, and debugging LLM and AI applications.

reading spans back from Phoenix ...
  traced 1 span(s): ['completion']
  UI: http://localhost:6006
```
