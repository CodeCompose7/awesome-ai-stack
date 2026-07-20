"""DSPy: declarative LM modules instead of hand-tuned prompts.

A typed signature (`question -> answer`) is the whole spec — DSPy builds the
prompt for you. The LM is routed through LiteLLM, so MODEL in `.env` picks the
provider (claude-opus-4-8 / gpt-4o / gemini/gemini-2.5-flash) without touching
the code.

Run:
    docker build -t aas-dspy .
    docker run --rm --env-file .env aas-dspy "Why is the sky blue?"
"""

import os
import sys

import dspy
from dotenv import load_dotenv

# Load .env when running locally; in Docker the keys come from --env-file.
load_dotenv()


DEFAULT_QUESTION = "Why is the sky blue? Answer in one sentence."


def main() -> None:
    question = " ".join(sys.argv[1:]) or DEFAULT_QUESTION

    # MODEL chooses the provider; dspy.LM routes it through LiteLLM.
    model = os.environ.get("MODEL", "claude-opus-4-8")
    dspy.configure(lm=dspy.LM(model=model))

    # ChainOfThought adds a reasoning step before producing the answer field.
    qa = dspy.ChainOfThought("question -> answer")
    result = qa(question=question)

    print(result.answer)


if __name__ == "__main__":
    main()
