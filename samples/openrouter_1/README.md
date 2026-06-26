# OpenRouter — one key, many models (via LiteLLM)

A tiny [OpenRouter](https://openrouter.ai/) script: it sends one prompt through
`litellm.completion()` and prints the reply. [OpenRouter](https://openrouter.ai/)
is an OpenAI-compatible gateway that fronts hundreds of models behind a single
API key — switch between **Claude**, **GPT**, **Gemini**, **Llama**, and more by
changing only `MODEL`, never the code.

## Configure

```bash
cd samples/openrouter_1
cp .env.sample .env
# edit .env: paste your OPENROUTER_API_KEY (and optionally change MODEL)
```

`MODEL` is a LiteLLM id of the form `openrouter/<vendor>/<model>`:

| Vendor / model   | `MODEL`                                          |
| ---------------- | ------------------------------------------------ |
| Anthropic Claude | `openrouter/anthropic/claude-opus-4-8`           |
| OpenAI           | `openrouter/openai/gpt-4o`                       |
| Google Gemini    | `openrouter/google/gemini-2.5-flash`             |
| Meta Llama       | `openrouter/meta-llama/llama-3.3-70b-instruct`   |

Every model uses the **same** `OPENROUTER_API_KEY`. Get one at
[openrouter.ai/keys](https://openrouter.ai/keys). Browse model ids at
[openrouter.ai/models](https://openrouter.ai/models). `.env` is gitignored —
only `.env.sample` is committed.

> **Tip:** model ids ending in `:free` (e.g.
> `openrouter/openai/gpt-oss-120b:free`) run without purchased credits, subject
> to rate limits. Paid models such as `openrouter/openai/gpt-4o` need credits on
> your account, or the request returns `402 Insufficient credits`.

## Run with Docker

```bash
cd samples/openrouter_1
docker build -t aas-openrouter .
docker run --rm --env-file .env aas-openrouter "Summarize OpenRouter in one line."
```

## Run with Docker (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the foreground `docker run` above often prints nothing and exits 0 — but the run
itself succeeds. The script runs to completion and Docker captures all of its
output; only the live **attached** stream drops it over the VM boundary. Run
**detached** and follow the logs instead:

```bash
cd samples/openrouter_1
docker build -t aas-openrouter .
docker logs -f "$(docker run -d --env-file .env aas-openrouter \
  "Summarize OpenRouter in one line.")"
```

## Run locally

```bash
cd samples/openrouter_1
pip install -r requirements.txt
python app.py "Summarize OpenRouter in one line."
```

`python-dotenv` loads `.env` automatically.

---

## Example run

> Output varies by model and run — LLMs are non-deterministic, so the exact
> wording differs each time. Below is one run with
> `openrouter/openai/gpt-oss-120b:free`.

```text
OpenRouter is an AI gateway that aggregates multiple language model providers into a single, unified API for easy, cost‑effective access to diverse LLMs.
```
