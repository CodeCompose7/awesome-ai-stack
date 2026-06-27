# Guardrails AI — implementation sample

A tiny [Guardrails AI](https://www.guardrailsai.com/docs) sample: it asks an LLM
for JSON, then validates that output against a Pydantic schema — coercing types
and enforcing `age >= 0` — before you trust it.

## Configure

```bash
cd samples/guardrails-ai_1
cp .env.sample .env
# edit .env: set OPENAI_API_KEY (used for the LLM call)
```

## Run with Docker

```bash
cd samples/guardrails-ai_1
docker build -t aas-guardrails .
docker run --rm --env-file .env aas-guardrails
```

## Run with Docker (in a devcontainer with DooD)

The foreground `docker run` may print nothing under Docker-outside-of-Docker —
run detached and follow the logs:

```bash
docker logs -f "$(docker run -d --env-file .env aas-guardrails)"
```

## Run locally

```bash
cd samples/guardrails-ai_1
pip install -r requirements.txt
python app.py
```

---

## Example run

> The model returns the JSON (with `Rex`, `dog`, `3`), and the Guard parses and
> validates it against the schema. One run with `gpt-4o-mini`:

```text
validation passed: True
validated output: {'name': 'Rex', 'species': 'dog', 'age': 3}
```
