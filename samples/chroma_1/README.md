# Chroma — vector similarity search (no server, no key)

A tiny [Chroma](https://www.trychroma.com) demo: it stores a few documents —
Chroma embeds them with a built-in model — then runs a nearest-neighbour query.
Swap the toy docs for your own and it is a RAG retriever. No API key.

## Run with Docker

```bash
cd samples/chroma_1
docker build -t aas-chroma .
docker run --rm aas-chroma "tell me about young cats"
```

The first query downloads Chroma's built-in embedding model (`all-MiniLM-L6-v2`,
~80 MB), so the run needs internet once.

## Run with Docker (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the attached `docker run` may print nothing even though it ran — the live
attached stream drops output over the VM boundary. Run **detached** and read the
logs:

```bash
cd samples/chroma_1
docker build -t aas-chroma .
docker logs -f "$(docker run -d aas-chroma "tell me about young cats")"
```

## Run locally

```bash
cd samples/chroma_1
pip install -r requirements.txt
python app.py "tell me about young cats"
```

---

## Example run

> Embeddings are deterministic (fixed model + input), so the ranking is the same
> every run — only the first run downloads the model.

```text
nearest to 'tell me about young cats' by distance:
  kitten     0.8413
  cat        1.0233
  rocket     1.8533
```
