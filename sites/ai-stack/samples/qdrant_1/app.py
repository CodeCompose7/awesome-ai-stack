"""Qdrant: vector similarity search with no server and no API key.

Stores a few documents in an in-memory Qdrant collection (fastembed embeds them
locally via `models.Document`), then runs a nearest-neighbour query. Swap the
toy docs for your own and it is a RAG retriever.

Run:
    docker build -t aas-qdrant .
    docker run --rm aas-qdrant "tell me about young cats"
"""

import sys

from qdrant_client import QdrantClient, models

MODEL = "BAAI/bge-small-en-v1.5"  # fastembed default, 384-dim

DOCS = {
    "cat": "Cats are independent pets that purr and chase laser pointers.",
    "kitten": "A kitten is a young cat that loves to play and nap.",
    "airplane": "An airplane is a powered flying vehicle with fixed wings.",
    "rocket": "A rocket is propelled by ejecting exhaust gas at high speed.",
}


def main() -> None:
    query = " ".join(sys.argv[1:]) or "tell me about young cats"

    client = QdrantClient(":memory:")  # in-memory; fastembed runs locally
    client.create_collection(
        "docs",
        vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE),
    )
    client.upsert(
        "docs",
        points=[
            models.PointStruct(
                id=i,
                vector=models.Document(text=text, model=MODEL),
                payload={"label": label},
            )
            for i, (label, text) in enumerate(DOCS.items())
        ],
    )

    hits = client.query_points(
        "docs",
        query=models.Document(text=query, model=MODEL),
        limit=3,
    ).points

    print(f"nearest to {query!r} by score:")
    for h in hits:
        print(f"  {h.payload['label']:10s} {h.score:.4f}")


if __name__ == "__main__":
    main()
