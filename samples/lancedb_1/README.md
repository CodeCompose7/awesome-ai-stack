# LanceDB — embedded vector search

A tiny [LanceDB](https://lancedb.com) script: it creates a table of vectors,
runs a nearest-neighbour search, and prints the closest row. Fully **embedded** —
no server, no API key, no network — so the output is deterministic.

## Run with Docker

```bash
cd samples/lancedb_1
docker build -t aas-lancedb .
docker run --rm aas-lancedb
```

## Run with Docker (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the foreground `docker run` above often prints nothing and exits 0 — but the run
itself succeeds. Run **detached** and follow the logs instead:

```bash
cd samples/lancedb_1
docker build -t aas-lancedb .
docker logs -f "$(docker run -d aas-lancedb)"
```

## Run locally

```bash
cd samples/lancedb_1
pip install -r requirements.txt
python app.py
```

---

## Example run

> LanceDB runs locally and this sample is deterministic, so the output is the
> same every run.

```text
nearest: Cats are independent pets that purr.
```
