"""DeepEval: score an LLM answer with a metric (LLM-as-judge).

Builds one test case and runs the Answer Relevancy metric. The judge model uses
OPENAI_API_KEY. Output is a score (0-1) with a short reason.

Run:
    docker build -t aas-deepeval .
    docker run --rm --env-file .env aas-deepeval
"""

import os

from dotenv import load_dotenv
from deepeval.metrics import AnswerRelevancyMetric
from deepeval.test_case import LLMTestCase

load_dotenv()

MODEL = os.environ.get("MODEL", "gpt-4o-mini")


def main() -> None:
    case = LLMTestCase(
        input="What language is Qdrant written in?",
        actual_output="Qdrant is written in Rust.",
    )
    metric = AnswerRelevancyMetric(model=MODEL)
    metric.measure(case)
    print(f"answer_relevancy: {metric.score:.2f}")
    print(f"reason: {metric.reason}")


if __name__ == "__main__":
    main()
