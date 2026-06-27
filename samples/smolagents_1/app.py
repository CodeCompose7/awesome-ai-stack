"""smolagents: a code agent that acts by writing and running Python.

The agent writes Python to solve the task, runs it, and returns the result.
Model is routed through LiteLLM, so any provider works via MODEL.

Run:
    docker build -t aas-smolagents .
    docker run --rm --env-file .env aas-smolagents "Compute 2 ** 10 + 5."
"""

import os
import sys

from dotenv import load_dotenv
from smolagents import CodeAgent, LiteLLMModel

load_dotenv()

MODEL = os.environ.get("MODEL", "anthropic/claude-opus-4-8")


def main() -> None:
    task = " ".join(sys.argv[1:]) or "Compute 2 ** 10 + 5 in Python and return the number."
    agent = CodeAgent(tools=[], model=LiteLLMModel(model_id=MODEL))
    print("result:", agent.run(task))


if __name__ == "__main__":
    main()
