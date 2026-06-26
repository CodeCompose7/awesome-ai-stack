"""Sentence Transformers: local embeddings + similarity search, no API key.

Embeds a few documents and a query with a model running on CPU, then ranks the
documents by cosine similarity. This is the local, provider-independent half of
a RAG pipeline.

Run:
    docker build -t aas-sentence-transformers .
    docker run --rm aas-sentence-transformers "tell me about young cats"
"""

import sys

from sentence_transformers import SentenceTransformer

DOCS = [
    "Cats are independent pets that purr and chase laser pointers.",
    "The stock market fell sharply today.",
    "A kitten is a young cat that loves to play and nap.",
    "A rocket is propelled by ejecting exhaust gas at high speed.",
]


def main() -> None:
    query = " ".join(sys.argv[1:]) or "tell me about young cats"

    # all-MiniLM-L6-v2 is small and fast; swap in BAAI/bge-m3 for multilingual.
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

    doc_emb = model.encode(DOCS)
    query_emb = model.encode(query)
    scores = model.similarity(query_emb, doc_emb)[0]  # cosine similarity

    print(f"nearest to {query!r} by cosine similarity:")
    for doc, score in sorted(zip(DOCS, scores.tolist()), key=lambda x: -x[1])[:3]:
        print(f"  {score:.4f}  {doc}")


if __name__ == "__main__":
    main()
