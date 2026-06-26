# Pydantic AI — a typed agent

A tiny [Pydantic AI](https://ai.pydantic.dev) script: it extracts a `Person`
(name, age, occupation) from free text. The agent's `output_type` is a Pydantic
model, so you get a validated object back — not a string to parse.

## Configure

```bash
cd samples/pydantic-ai_1
cp .env.sample .env
# edit .env: set MODEL and the matching provider key
```

`MODEL` is a `provider:model` string:

| Provider          | `MODEL`                       | Key in `.env`       |
| ----------------- | ----------------------------- | ------------------- |
| Anthropic Claude  | `anthropic:claude-opus-4-8`   | `ANTHROPIC_API_KEY` |
| OpenAI            | `openai:gpt-4o`               | `OPENAI_API_KEY`    |
| Google AI Studio  | `google-gla:gemini-2.5-flash` | `GEMINI_API_KEY`    |

`.env` is gitignored — only `.env.sample` is committed.

## Run with Docker

```bash
cd samples/pydantic-ai_1
docker build -t aas-pydantic-ai .
docker run --rm --env-file .env aas-pydantic-ai \
  "Ada Lovelace, 36, was a mathematician and the first programmer."
```

## Run with Docker (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the foreground `docker run` above often prints nothing and exits 0 — but the run
itself succeeds. The script runs to completion and Docker captures all of its
output; only the live **attached** stream drops it over the VM boundary. Run
**detached** and follow the logs instead:

```bash
cd samples/pydantic-ai_1
docker build -t aas-pydantic-ai .
docker logs -f "$(docker run -d --env-file .env aas-pydantic-ai \
  "Ada Lovelace, 36, was a mathematician and the first programmer.")"
```

## Run locally

```bash
cd samples/pydantic-ai_1
pip install -r requirements.txt
python app.py "Ada Lovelace, 36, was a mathematician and the first programmer."
```

`python-dotenv` loads `.env` automatically.

---

## Example run

> Output varies by model and run — LLMs are non-deterministic. The *shape* is
> fixed by the Pydantic model; the values are extracted. Below is one run with
> `anthropic:claude-opus-4-8`.

```text
name='Ada Lovelace' age=36 occupation='Mathematician'
```
