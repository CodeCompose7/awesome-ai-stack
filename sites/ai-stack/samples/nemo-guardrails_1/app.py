"""NeMo Guardrails: put programmable rails around an LLM.

Loads a tiny rails config — a greeting flow written in Colang — and generates a
reply. The rail maps a user greeting to a fixed, safe bot message instead of
free-form output, showing how rails steer a conversation. Both the main and the
embedding model are OpenAI, so only OPENAI_API_KEY is needed (no local download).

Run:
    docker build -t aas-nemo .
    docker run --rm --env-file .env aas-nemo
"""

import os

from dotenv import load_dotenv
from nemoguardrails import LLMRails, RailsConfig

load_dotenv()

MODEL = os.environ.get("MODEL", "gpt-4o-mini")

YAML_CONFIG = f"""
models:
  - type: main
    engine: openai
    model: {MODEL}
  - type: embeddings
    engine: openai
    model: text-embedding-3-small
"""

COLANG_CONFIG = """
define user express greeting
  "hello"
  "hi there"
  "hey"

define bot express greeting
  "Hello! I'm a guardrailed assistant — I only respond through approved rails."

define flow greeting
  user express greeting
  bot express greeting
"""


def main() -> None:
    config = RailsConfig.from_content(
        yaml_content=YAML_CONFIG,
        colang_content=COLANG_CONFIG,
    )
    rails = LLMRails(config)

    response = rails.generate(messages=[{"role": "user", "content": "hi there"}])
    print("bot:", response["content"])


if __name__ == "__main__":
    main()
