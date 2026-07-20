# Milvus Lite — embedded vector search

A tiny [Milvus](https://milvus.io) script using **Milvus Lite**: it creates a
collection, inserts a few vectors, runs a similarity search, and prints the
closest row. Embedded from a local file — no server, no API key, no network — so
the output is deterministic.

## Run with Docker

```bash
cd samples/milvus_1
docker build -t aas-milvus .
docker run --rm aas-milvus
```

## Run with Docker (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the foreground `docker run` above often prints nothing and exits 0 — but the run
itself succeeds. Run **detached** and follow the logs instead:

```bash
cd samples/milvus_1
docker build -t aas-milvus .
docker logs -f "$(docker run -d aas-milvus)"
```

## Run locally

```bash
cd samples/milvus_1
pip install -r requirements.txt
python app.py
```

The same `MilvusClient` API scales from Milvus Lite to a self-hosted Milvus
cluster or Zilliz Cloud — just pass a server URI instead of a file path.

---

## Example run

> Milvus Lite runs locally and this sample is deterministic, so the output is
> the same every run.

```text
nearest: Cats are independent pets that purr.
```
