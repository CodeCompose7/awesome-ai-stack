"""CrewAI: a one-agent crew that runs a task.

Defines an agent (role + goal) and a task, groups them in a Crew, and kicks it
off. The agent's `llm` is a LiteLLM-style string, so MODEL in `.env` picks the
provider without touching the code.

Run:
    docker build -t aas-crewai .
    docker run --rm --env-file .env aas-crewai "CrewAI"
"""

import os
import sys

from crewai import Agent, Crew, Task
from dotenv import load_dotenv

# Load .env when running locally; in Docker the keys come from --env-file.
load_dotenv()

MODEL = os.environ.get("MODEL", "anthropic/claude-opus-4-8")


def main() -> None:
    topic = " ".join(sys.argv[1:]) or "CrewAI"

    writer = Agent(
        role="Technical writer",
        goal="Explain tools clearly and briefly",
        backstory="You write concise one-sentence summaries.",
        llm=MODEL,
    )
    task = Task(
        description=f"Summarize what {topic} does in one sentence.",
        expected_output="a single sentence",
        agent=writer,
    )

    crew = Crew(agents=[writer], tasks=[task])
    print(crew.kickoff())


if __name__ == "__main__":
    main()
