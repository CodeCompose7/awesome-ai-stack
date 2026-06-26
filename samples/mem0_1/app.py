"""Mem0: store a memory, then recall it.

Adds a fact for a user, then searches — Mem0 distils messages into compact
facts (with an LLM) and recalls the relevant ones (from a vector store). The
config below uses OpenAI, so set OPENAI_API_KEY.

Run:
    docker build -t aas-mem0 .
    docker run --rm --env-file .env aas-mem0 "what are alice's travel preferences?"
"""

import sys

from dotenv import load_dotenv
from mem0 import Memory

# Load .env when running locally; in Docker the key comes from --env-file.
load_dotenv()

# Pin the OpenAI models Mem0 uses (the default model rejects a custom temperature).
CONFIG = {
    "llm": {"provider": "openai", "config": {"model": "gpt-4o-mini"}},
    "embedder": {"provider": "openai", "config": {"model": "text-embedding-3-small"}},
}


def main() -> None:
    query = " ".join(sys.argv[1:]) or "what are alice's travel preferences?"
    user = "alice"

    m = Memory.from_config(CONFIG)
    m.add("I prefer window seats and vegetarian meals.", user_id=user)

    # Mem0 2.x takes the user as a filter on search.
    results = m.search(query, filters={"user_id": user})

    print(f"query: {query}")
    for r in results["results"]:
        print(f"  - {r['memory']}")


if __name__ == "__main__":
    main()
