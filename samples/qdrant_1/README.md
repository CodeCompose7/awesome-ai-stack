# Qdrant — vector similarity search (no server, no key)

A tiny [Qdrant](https://qdrant.tech) demo: it stores a few documents in an
in-memory collection — fastembed embeds them locally — then runs a
nearest-neighbour query. Swap the toy docs for your own and it is a RAG
retriever. No API key.

## Run with Docker

```bash
cd samples/qdrant_1
docker build -t aas-qdrant .
docker run --rm aas-qdrant "tell me about young cats"
```

The first run downloads a small fastembed model (`BAAI/bge-small-en-v1.5`,
~130 MB), so it needs internet once.

## Run with Docker (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the attached `docker run` may print nothing even though it ran — the live
attached stream drops output over the VM boundary. Run **detached** and read the
logs:

```bash
cd samples/qdrant_1
docker build -t aas-qdrant .
docker logs -f "$(docker run -d aas-qdrant "tell me about young cats")"
```

## Run locally

```bash
cd samples/qdrant_1
pip install -r requirements.txt
python app.py "tell me about young cats"
```

---

## Example run

> Embeddings are deterministic (fixed model + input), so the ranking is the same
> every run — only the first run downloads the model.

```text
nearest to 'tell me about young cats' by score:
  kitten     0.7082
  cat        0.6450
  airplane   0.4201
```
