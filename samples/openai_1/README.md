# OpenAI — a minimal chat call

A tiny [OpenAI](https://platform.openai.com/docs) script: it sends one prompt to
a GPT model with the official SDK and prints the reply.

## Configure

```bash
cd samples/openai_1
cp .env.sample .env
# edit .env: set OPENAI_API_KEY (and optionally MODEL)
```

Get a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys).
`MODEL` defaults to `gpt-4o`. `.env` is gitignored — only `.env.sample` is committed.

## Run with Docker

```bash
cd samples/openai_1
docker build -t aas-openai .
docker run --rm --env-file .env aas-openai "Summarize OpenAI's API in one sentence."
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
cd samples/openai_1
docker build -t aas-openai .
docker logs -f "$(docker run -d --env-file .env aas-openai \
  "Summarize OpenAI's API in one sentence.")"
```

## Run locally

```bash
cd samples/openai_1
pip install -r requirements.txt
python app.py "Summarize OpenAI's API in one sentence."
```

`python-dotenv` loads `.env` automatically.

---

## Example run

> Output varies by model and run — LLMs are non-deterministic, so the wording
> differs each time. Below is one run with `gpt-4o`.

```text
OpenAI's API provides developers with access to advanced AI models for natural
language processing, enabling tasks like text generation, editing, and
understanding, as well as other capabilities such as image and code analysis.
```
