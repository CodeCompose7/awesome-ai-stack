"""pgvector: vector similarity search inside Postgres.

Creates a `vector` column, stores a few toy "embeddings", and runs a
nearest-neighbour query with the cosine-distance operator (`<=>`). A real app
swaps the toy vectors for an embedding model's output — the SQL is identical.

Run (with the bundled Postgres):
    docker compose up --build
"""

import os
import sys

import psycopg
from dotenv import load_dotenv

# Load .env when running locally; docker-compose sets DATABASE_URL directly.
load_dotenv()

DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres")

# Toy 3-dim "embeddings" — in practice these come from an embedding model.
DOCS = [
    ("cat", "[1.0, 0.1, 0.0]"),
    ("kitten", "[0.9, 0.2, 0.1]"),
    ("airplane", "[0.0, 0.1, 1.0]"),
    ("rocket", "[0.1, 0.0, 0.9]"),
]


def main() -> None:
    target = (sys.argv[1] if len(sys.argv) > 1 else "cat").lower()
    query_vec = dict(DOCS).get(target, DOCS[0][1])

    with psycopg.connect(DSN, autocommit=True) as conn:
        conn.execute("CREATE EXTENSION IF NOT EXISTS vector")
        conn.execute("DROP TABLE IF EXISTS docs")
        conn.execute("CREATE TABLE docs (id serial PRIMARY KEY, label text, embedding vector(3))")
        for label, embedding in DOCS:
            conn.execute("INSERT INTO docs (label, embedding) VALUES (%s, %s)", (label, embedding))

        rows = conn.execute(
            "SELECT label, embedding <=> %s::vector AS distance FROM docs ORDER BY distance LIMIT 4",
            (query_vec,),
        ).fetchall()

    print(f"nearest to '{target}' by cosine distance:")
    for label, distance in rows:
        marker = "  (query)" if label == target else ""
        print(f"  {label:10s} {distance:.4f}{marker}")


if __name__ == "__main__":
    main()
