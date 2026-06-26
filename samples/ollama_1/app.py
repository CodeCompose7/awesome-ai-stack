"""Ollama: a local LLM call routed through LiteLLM.

Calls a model running in a local Ollama server — no API key. Routing through
LiteLLM means the same code also works against cloud models by changing MODEL.

Run (with Ollama running on the host):
    docker build -t aas-ollama .
    docker run --rm --env-file .env aas-ollama "Summarize Ollama in one line."
"""

import os
import sys

from dotenv import load_dotenv
from litellm import completion

# Load .env when running locally; in Docker the config comes from --env-file.
load_dotenv()

# ollama_chat/ uses Ollama's /api/chat endpoint (supports tool calling).
MODEL = os.environ.get("MODEL", "ollama_chat/qwen3.5:9b")


def main() -> None:
    prompt = " ".join(sys.argv[1:]) or "Summarize what Ollama does in one sentence."

    resp = completion(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        api_base=os.environ.get("OLLAMA_API_BASE", "http://localhost:11434"),
    )
    print(resp.choices[0].message.content)


if __name__ == "__main__":
    main()
