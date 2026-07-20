"""OpenAI: a minimal chat call with the official SDK.

Sends one prompt to a GPT model and prints the reply. The point is the smallest
real call — `chat.completions.create` — that most of the ecosystem mirrors.

Run:
    docker build -t aas-openai .
    docker run --rm --env-file .env aas-openai "Summarize OpenAI in one line."
"""

import os
import sys

from dotenv import load_dotenv
from openai import OpenAI

# Load .env when running locally; in Docker the key comes from --env-file.
load_dotenv()

client = OpenAI()  # reads OPENAI_API_KEY
MODEL = os.environ.get("MODEL", "gpt-4o")


def main() -> None:
    prompt = " ".join(sys.argv[1:]) or "Summarize what OpenAI's API offers in one sentence."

    resp = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
    )
    print(resp.choices[0].message.content)


if __name__ == "__main__":
    main()
