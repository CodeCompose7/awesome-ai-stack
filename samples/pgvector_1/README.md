# pgvector — vector similarity search in Postgres

A tiny [pgvector](https://github.com/pgvector/pgvector) demo: it creates a
`vector` column, stores a few toy 3-dim "embeddings", and runs a
nearest-neighbour query with the cosine-distance operator (`<=>`). Swap the toy
vectors for an embedding model's output and the SQL is unchanged.

## Run with Docker Compose (bundled Postgres)

The compose file starts a `pgvector/pgvector` Postgres and runs the app against
it:

```bash
cd samples/pgvector_1
docker compose up --build
```

Expected output:

```text
nearest to 'cat' by cosine distance:
  cat        0.0000  (query)
  kitten     0.0129
  rocket     0.8901
  airplane   0.9901
```

Change the query word in `docker-compose.yml` (`command: ["cat"]`) — try
`rocket` to see the neighbours flip.

## Run with Docker Compose (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the attached `docker compose up` may print nothing for the app even though it
ran — the live attached stream drops output over the VM boundary. Read it back
from the logs:

```bash
cd samples/pgvector_1
docker compose up --build -d
docker compose logs -f app
docker compose down -v
```

## Run locally

Point `DATABASE_URL` at a Postgres that has the `vector` extension available:

```bash
cd samples/pgvector_1
cp .env.sample .env          # edit DATABASE_URL if needed
pip install -r requirements.txt
python app.py cat
```

`.env` is gitignored — only `.env.sample` is committed.
