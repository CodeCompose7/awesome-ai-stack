"""LiteLLM: one provider-agnostic call for every model.

LiteLLM exposes 100+ providers behind a single OpenAI-style `completion()`
call. Pick the model with MODEL in `.env` (claude-opus-4-8, gpt-4o,
gemini/gemini-2.5-flash, …) and the calling code never changes — LiteLLM routes
the request to the right provider and normalizes the response back.

Run:
    docker build -t aas-litellm .
    docker run --rm --env-file .env aas-litellm "Summarize litellm in one line."
"""

import os
import sys

import litellm
from dotenv import load_dotenv

# Load .env when running locally; in Docker the keys come from --env-file.
load_dotenv()

# Drop params a given provider doesn't support, so one call works everywhere.
litellm.drop_params = True


DEFAULT_PROMPT = "Summarize what LiteLLM does in one sentence."


def main() -> None:
    prompt = " ".join(sys.argv[1:]) or DEFAULT_PROMPT

    # MODEL chooses the provider (claude-opus-4-8 / gpt-4o / gemini/gemini-2.5-flash).
    model = os.environ.get("MODEL", "claude-opus-4-8")

    resp = litellm.completion(
        model=model,
        messages=[{"role": "user", "content": prompt}],
    )
    print(resp.choices[0].message.content)


if __name__ == "__main__":
    main()
