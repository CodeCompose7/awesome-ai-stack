"""Agno: a single agent backed by Claude (Anthropic).

Builds one Agno agent and runs a prompt. Model is configurable via MODEL.

Run:
    docker build -t aas-agno .
    docker run --rm --env-file .env aas-agno "Say hello in one short sentence."
"""

import os
import sys

from dotenv import load_dotenv
from agno.agent import Agent
from agno.models.anthropic import Claude

load_dotenv()

MODEL = os.environ.get("MODEL", "claude-opus-4-8")


def main() -> None:
    prompt = " ".join(sys.argv[1:]) or "Say hello in one short sentence."
    agent = Agent(model=Claude(id=MODEL), markdown=False)
    print(agent.run(prompt).content)


if __name__ == "__main__":
    main()
