# LiteLLM — one interface, any provider

A tiny [LiteLLM](https://docs.litellm.ai/) script: it sends one prompt through
`litellm.completion()` and prints the reply. The **same call** works with
**Anthropic Claude**, **OpenAI**, or **Google AI Studio (Gemini)** — change
`MODEL` in `.env`, never the code.

## Configure

```bash
cd samples/litellm_1
cp .env.sample .env
# edit .env: set MODEL and the matching provider key
```

`MODEL` picks the provider:

| Provider          | `MODEL` example           | Key in `.env`       |
| ----------------- | ------------------------- | ------------------- |
| Anthropic Claude  | `claude-opus-4-8`         | `ANTHROPIC_API_KEY` |
| OpenAI            | `gpt-4o`                  | `OPENAI_API_KEY`    |
| Google AI Studio  | `gemini/gemini-2.5-flash` | `GEMINI_API_KEY`    |

`.env` is gitignored — only `.env.sample` is committed.

## Run with Docker

```bash
cd samples/litellm_1
docker build -t aas-litellm .
docker run --rm --env-file .env aas-litellm "Summarize litellm in one line."
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
cd samples/litellm_1
docker build -t aas-litellm .
docker logs -f "$(docker run -d --env-file .env aas-litellm \
  "Summarize litellm in one line.")"
```

## Run locally

```bash
cd samples/litellm_1
pip install -r requirements.txt
python app.py "Summarize litellm in one line."
```

`python-dotenv` loads `.env` automatically. Get keys from
[Anthropic](https://console.anthropic.com/),
[OpenAI](https://platform.openai.com/api-keys), or
[Google AI Studio](https://aistudio.google.com/apikey).
