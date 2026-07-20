"""LlamaIndex: index a few documents and answer a question grounded in them.

Builds an in-memory vector index over two documents (OpenAI embeddings), then
runs a query engine (OpenAI LLM) and prints the grounded answer.

Run:
    docker build -t aas-llamaindex .
    docker run --rm --env-file .env aas-llamaindex "What language is Qdrant written in?"
"""

import os
import sys

from dotenv import load_dotenv
from llama_index.core import Document, VectorStoreIndex
from llama_index.llms.openai import OpenAI

load_dotenv()

MODEL = os.environ.get("MODEL", "gpt-4o-mini")


def main() -> None:
    question = " ".join(sys.argv[1:]) or "What language is Qdrant written in?"
    docs = [
        Document(text="Qdrant is a vector database written in Rust."),
        Document(text="LlamaIndex builds RAG pipelines over your own data."),
    ]
    index = VectorStoreIndex.from_documents(docs)
    engine = index.as_query_engine(llm=OpenAI(model=MODEL))
    print(engine.query(question))


if __name__ == "__main__":
    main()
