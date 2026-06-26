# instructor — structured output from an LLM

A tiny [instructor](https://python.useinstructor.com) script: it extracts a
typed `Person` (name, age, occupation) from free text. You define a Pydantic
model and get a validated object back — not a string to parse. `from_litellm`
routes the call, so `MODEL` picks the provider.

## Configure

```bash
cd samples/instructor_1
cp .env.sample .env
# edit .env: set MODEL and the matching provider key
```

`MODEL` is a LiteLLM-style name:

| Provider          | `MODEL` example             | Key in `.env`       |
| ----------------- | --------------------------- | ------------------- |
| Anthropic Claude  | `anthropic/claude-opus-4-8` | `ANTHROPIC_API_KEY` |
| OpenAI            | `openai/gpt-4o`             | `OPENAI_API_KEY`    |
| Google AI Studio  | `gemini/gemini-2.5-flash`   | `GEMINI_API_KEY`    |

`.env` is gitignored — only `.env.sample` is committed.

## Run with Docker

```bash
cd samples/instructor_1
docker build -t aas-instructor .
docker run --rm --env-file .env aas-instructor \
  "Ada Lovelace, 36, was a mathematician and the first programmer."
```

## Run with Docker (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the foreground `docker run` above often prints nothing and exits 0 — but the run
itself succeeds. The script runs to completion and Docker captures all of its
output; only the live **attached** stream drops it over the VM boundary. Run
**detached** and follow the logs instead:

```bash
cd samples/instructor_1
docker build -t aas-instructor .
docker logs -f "$(docker run -d --env-file .env aas-instructor \
  "Ada Lovelace, 36, was a mathematician and the first programmer.")"
```

## Run locally

```bash
cd samples/instructor_1
pip install -r requirements.txt
python app.py "Ada Lovelace, 36, was a mathematician and the first programmer."
```

`python-dotenv` loads `.env` automatically.

---

## Example run

> Output varies by model and run — LLMs are non-deterministic. The *shape* is
> fixed by the Pydantic model; the values are extracted. Below is one run with
> `anthropic/claude-opus-4-8`.

```text
{'name': 'Ada Lovelace', 'age': 36, 'occupation': 'Mathematician'}
```
