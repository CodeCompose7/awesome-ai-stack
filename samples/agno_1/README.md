# Agno — a single agent backed by Claude

A tiny [Agno](https://www.agno.com) sample: it builds one agent with a Claude
model and runs your prompt.

## Configure

```bash
cd samples/agno_1
cp .env.sample .env
# edit .env: set ANTHROPIC_API_KEY (and optionally MODEL)
```

## Run with Docker

```bash
cd samples/agno_1
docker build -t aas-agno .
docker run --rm --env-file .env aas-agno "Say hello in one short sentence."
```

## Run with Docker (in a devcontainer with DooD)

The foreground `docker run` may print nothing under Docker-outside-of-Docker —
run detached and follow the logs:

```bash
docker logs -f "$(docker run -d --env-file .env aas-agno "Say hello in one short sentence.")"
```

## Run locally

```bash
cd samples/agno_1
pip install -r requirements.txt
python app.py "Say hello in one short sentence."
```

---

## Example run

> Output varies by model and run — LLMs are non-deterministic. One run with
> `claude-opus-4-8`:

```text
Hello, it's nice to meet you!
```
