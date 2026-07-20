"""Ragas: evaluate a RAG answer with reference-free metrics.

Scores one (question, answer, context) sample for faithfulness and response
relevancy, judged by an OpenAI model + embeddings (OPENAI_API_KEY).

Run:
    docker build -t aas-ragas .
    docker run --rm --env-file .env aas-ragas
"""

import os

from dotenv import load_dotenv
from ragas import EvaluationDataset, evaluate
from ragas.metrics import Faithfulness, ResponseRelevancy
from ragas.llms import LangchainLLMWrapper
from ragas.embeddings import LangchainEmbeddingsWrapper
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

load_dotenv()

MODEL = os.environ.get("MODEL", "gpt-4o-mini")


def main() -> None:
    dataset = EvaluationDataset.from_list(
        [
            {
                "user_input": "What language is Qdrant written in?",
                "response": "Qdrant is written in Rust.",
                "retrieved_contexts": ["Qdrant is a vector database written in Rust."],
            }
        ]
    )
    llm = LangchainLLMWrapper(ChatOpenAI(model=MODEL))
    embeddings = LangchainEmbeddingsWrapper(OpenAIEmbeddings())

    result = evaluate(
        dataset,
        metrics=[Faithfulness(llm=llm), ResponseRelevancy(llm=llm, embeddings=embeddings)],
    )
    print(result)


if __name__ == "__main__":
    main()
