# Mem0 — store and recall a memory

A tiny [Mem0](https://mem0.ai) script: it adds a fact for a user, then searches
for it. Mem0 distils messages into compact facts (with an LLM) and recalls the
relevant ones (from a vector store). The config uses OpenAI.

## Configure

```bash
cd samples/mem0_1
cp .env.sample .env
# edit .env: set OPENAI_API_KEY
```

Mem0's config here uses OpenAI for fact extraction and embeddings. Get a key at
[platform.openai.com/api-keys](https://platform.openai.com/api-keys). `.env` is
gitignored — only `.env.sample` is committed.

## Run with Docker

```bash
cd samples/mem0_1
docker build -t aas-mem0 .
docker run --rm --env-file .env aas-mem0 "what are alice's travel preferences?"
```

## Run with Docker (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the foreground `docker run` above often prints nothing and exits 0 — but the run
itself succeeds. The script runs to completion and Docker captures all of its
output; only the live **attached** stream drops it over the VM boundary. Run
**detached** and follow the logs instead:

```bash
cd samples/mem0_1
docker build -t aas-mem0 .
docker logs -f "$(docker run -d --env-file .env aas-mem0 \
  "what are alice's travel preferences?")"
```

## Run locally

```bash
cd samples/mem0_1
pip install -r requirements.txt
python app.py "what are alice's travel preferences?"
```

`python-dotenv` loads `.env` automatically.

---

## Example run

> Output varies by model and run — LLMs are non-deterministic, so the recalled
> phrasing differs each time. Below is one run (extraction + recall via OpenAI).

```text
query: what are alice's travel preferences?
  - User prefers window seats when traveling and enjoys vegetarian meals.
```
