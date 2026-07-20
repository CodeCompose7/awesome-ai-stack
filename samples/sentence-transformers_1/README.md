# Sentence Transformers — local embeddings + similarity

A tiny [Sentence Transformers](https://sbert.net) demo: it embeds a few
documents and a query on CPU, then ranks the documents by cosine similarity. No
API key — the model runs locally.

> **Heavy image.** Pulls PyTorch (~several GB), so the first build is slow.

## Run with Docker

```bash
cd samples/sentence-transformers_1
docker build -t aas-sentence-transformers .
docker run --rm aas-sentence-transformers "tell me about young cats"
```

The first run downloads the model (`all-MiniLM-L6-v2`, ~80 MB), so it needs
internet once. Swap in `BAAI/bge-m3` in `app.py` for a multilingual model.

## Run with Docker (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the attached `docker run` may print nothing even though it ran — the live
attached stream drops output over the VM boundary. Run **detached** and read the
logs:

```bash
cd samples/sentence-transformers_1
docker build -t aas-sentence-transformers .
docker logs -f "$(docker run -d aas-sentence-transformers "tell me about young cats")"
```

## Run locally

```bash
cd samples/sentence-transformers_1
pip install -r requirements.txt
python app.py "tell me about young cats"
```

---

## Example run

> Embeddings are deterministic (fixed model + input), so the ranking is the same
> every run — only the first run downloads the model.

```text
nearest to 'tell me about young cats' by cosine similarity:
  0.5793  A kitten is a young cat that loves to play and nap.
  0.4883  Cats are independent pets that purr and chase laser pointers.
  0.0734  A rocket is propelled by ejecting exhaust gas at high speed.
```
