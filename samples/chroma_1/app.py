"""Chroma: vector similarity search with no server and no API key.

Stores a few documents in an in-memory Chroma collection (Chroma embeds them
with a built-in model), then runs a nearest-neighbour query. Swap the toy docs
for your own and it is a RAG retriever.

Run:
    docker build -t aas-chroma .
    docker run --rm aas-chroma "tell me about young cats"
"""

import sys

import chromadb

DOCS = {
    "cat": "Cats are independent pets that purr and chase laser pointers.",
    "kitten": "A kitten is a young cat that loves to play and nap.",
    "airplane": "An airplane is a powered flying vehicle with fixed wings.",
    "rocket": "A rocket is propelled by ejecting exhaust gas at high speed.",
}


def main() -> None:
    query = " ".join(sys.argv[1:]) or "tell me about young cats"

    client = chromadb.Client()  # in-memory; built-in embedding model
    col = client.create_collection("docs")
    col.add(ids=list(DOCS), documents=list(DOCS.values()))

    res = col.query(query_texts=[query], n_results=3)

    print(f"nearest to {query!r} by distance:")
    for label, dist in zip(res["ids"][0], res["distances"][0]):
        print(f"  {label:10s} {dist:.4f}")


if __name__ == "__main__":
    main()
