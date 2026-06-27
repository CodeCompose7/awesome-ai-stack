# LlamaIndex — implementation sample

A tiny [LlamaIndex](https://www.llamaindex.ai) sample: it indexes two documents
and answers a question grounded in them (OpenAI embeddings + LLM).

## Configure

```bash
cd samples/llamaindex_1
cp .env.sample .env
# edit .env: set OPENAI_API_KEY (used for embeddings + the LLM)
```

## Run with Docker

```bash
cd samples/llamaindex_1
docker build -t aas-llamaindex .
docker run --rm --env-file .env aas-llamaindex "What language is Qdrant written in?"
```

## Run with Docker (in a devcontainer with DooD)

The foreground `docker run` may print nothing under Docker-outside-of-Docker —
run detached and follow the logs:

```bash
docker logs -f "$(docker run -d --env-file .env aas-llamaindex "What language is Qdrant written in?")"
```

## Run locally

```bash
cd samples/llamaindex_1
pip install -r requirements.txt
python app.py "What language is Qdrant written in?"
```

---

## Example run

> Output varies by model and run — LLMs are non-deterministic. One run with
> `gpt-4o-mini`:

```text
Qdrant is written in Rust.
```
