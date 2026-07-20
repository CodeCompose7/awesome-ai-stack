"""Guardrails AI: validate an LLM's output against a typed schema.

The model is asked for JSON (our prompt), then a Guard built from a Pydantic
schema parses and validates that output — coercing types and enforcing
constraints (here, age >= 0) before you trust it. The LLM call uses
OPENAI_API_KEY via LiteLLM.

Run:
    docker build -t aas-guardrails .
    docker run --rm --env-file .env aas-guardrails
"""

import os

from dotenv import load_dotenv
from pydantic import BaseModel, Field
from guardrails import Guard
from litellm import completion

load_dotenv()

MODEL = os.environ.get("MODEL", "gpt-4o-mini")


class Pet(BaseModel):
    name: str = Field(description="the pet's name")
    species: str = Field(description="the kind of animal, e.g. dog or cat")
    age: int = Field(description="age in whole years", ge=0)


def main() -> None:
    # 1) The model produces output from our prompt — we control what it sees.
    raw = completion(
        model=MODEL,
        temperature=0,
        messages=[
            {
                "role": "user",
                "content": (
                    "Extract the pet into a JSON object with keys name, species, age. "
                    "Return only the JSON.\n\nSentence: Rex is a three-year-old dog."
                ),
            }
        ],
    ).choices[0].message.content

    # 2) Guardrails parses + validates that output against the Pet schema.
    guard = Guard.for_pydantic(Pet)
    outcome = guard.parse(raw)

    print("raw model output:", raw)
    print("validation passed:", outcome.validation_passed)
    print("validated output:", outcome.validated_output)


if __name__ == "__main__":
    main()
