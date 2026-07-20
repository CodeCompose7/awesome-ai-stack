"""OpenAI Agents SDK: define an agent and run it.

Run:
    docker build -t aas-openai-agents .
    docker run --rm --env-file .env aas-openai-agents "Summarize AI agents in one sentence."
"""

import os
import sys

from dotenv import load_dotenv
from agents import Agent, Runner

load_dotenv()

MODEL = os.environ.get("MODEL", "gpt-4o-mini")


def main() -> None:
    prompt = " ".join(sys.argv[1:]) or "Summarize what an AI agent is in one sentence."
    agent = Agent(name="Assistant", instructions="You are concise and helpful.", model=MODEL)
    print(Runner.run_sync(agent, prompt).final_output)


if __name__ == "__main__":
    main()
