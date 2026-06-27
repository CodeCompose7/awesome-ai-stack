"""Milvus Lite: embedded Milvus from a local file — no server to start.

Creates a collection, inserts a few vectors, runs a similarity search, and
prints the closest row. Fully local and deterministic: no API key, no network.

Run:
    docker build -t aas-milvus .
    docker run --rm aas-milvus
"""

from pymilvus import MilvusClient


def main() -> None:
    client = MilvusClient("/tmp/milvus-demo.db")  # Milvus Lite — embedded file
    if client.has_collection("docs"):
        client.drop_collection("docs")
    client.create_collection("docs", dimension=4)
    client.insert(
        "docs",
        [
            {"id": 1, "vector": [0.1, 0.2, 0.3, 0.4], "text": "Cats are independent pets that purr."},
            {"id": 2, "vector": [0.9, 0.8, 0.7, 0.6], "text": "A rocket is propelled by ejecting exhaust."},
        ],
    )

    hits = client.search("docs", data=[[0.12, 0.21, 0.29, 0.41]], limit=1, output_fields=["text"])
    print("nearest:", hits[0][0]["entity"]["text"])


if __name__ == "__main__":
    main()
