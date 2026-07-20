"""instructor: structured, validated output from an LLM.

Extracts a typed `Person` from free text. `from_provider` routes through
LiteLLM, so MODEL in `.env` picks the provider (claude / gpt / gemini) without
touching the code; instructor returns a validated Pydantic object, not text.

Run:
    docker build -t aas-instructor .
    docker run --rm --env-file .env aas-instructor "Ada Lovelace, 36, was a mathematician."
"""

import os
import sys

import instructor
import litellm
from dotenv import load_dotenv
from pydantic import BaseModel

# Load .env when running locally; in Docker the keys come from --env-file.
load_dotenv()

MODEL = os.environ.get("MODEL", "anthropic/claude-opus-4-8")


class Person(BaseModel):
    name: str
    age: int
    occupation: str


def main() -> None:
    text = " ".join(sys.argv[1:]) or "Ada Lovelace, 36, was a mathematician and the first programmer."

    # from_litellm keeps dependencies to litellm only (no per-provider SDKs).
    client = instructor.from_litellm(litellm.completion)
    person = client.chat.completions.create(
        model=MODEL,
        response_model=Person,
        messages=[{"role": "user", "content": f"Extract the person from: {text}"}],
    )

    print(person.model_dump())


if __name__ == "__main__":
    main()
