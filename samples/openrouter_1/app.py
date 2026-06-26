"""OpenRouter: one gateway to many models, called through LiteLLM.

Sends one prompt to a model on OpenRouter. The `openrouter/<vendor>/<model>`
prefix routes through OpenRouter with your OPENROUTER_API_KEY, so you can reach
Claude, GPT, Gemini, Llama, and more with a single key by changing MODEL.

Run:
    docker build -t aas-openrouter .
    docker run --rm --env-file .env aas-openrouter "Summarize OpenRouter in one line."
"""

import os
import sys

from dotenv import load_dotenv
from litellm import completion

# Load .env when running locally; in Docker the config comes from --env-file.
load_dotenv()

MODEL = os.environ.get("MODEL", "openrouter/anthropic/claude-opus-4-8")


def main() -> None:
    prompt = " ".join(sys.argv[1:]) or "Summarize what OpenRouter does in one sentence."

    resp = completion(model=MODEL, messages=[{"role": "user", "content": prompt}])
    print(resp.choices[0].message.content)


if __name__ == "__main__":
    main()
