"""Pydantic AI: a typed agent that returns a validated object.

Extracts a `Person` from free text. The agent's `output_type` is a Pydantic
model, so the result is a validated Python object — not text to parse. MODEL is
a "provider:model" string, so switch providers by changing it.

Run:
    docker build -t aas-pydantic-ai .
    docker run --rm --env-file .env aas-pydantic-ai "Ada Lovelace, 36, was a mathematician."
"""

import os
import sys

from dotenv import load_dotenv
from pydantic import BaseModel
from pydantic_ai import Agent

# Load .env when running locally; in Docker the keys come from --env-file.
load_dotenv()

MODEL = os.environ.get("MODEL", "anthropic:claude-opus-4-8")


class Person(BaseModel):
    name: str
    age: int
    occupation: str


def main() -> None:
    text = " ".join(sys.argv[1:]) or "Ada Lovelace, 36, was a mathematician and the first programmer."

    agent = Agent(MODEL, output_type=Person)
    result = agent.run_sync(f"Extract the person from: {text}")

    print(result.output)


if __name__ == "__main__":
    main()
