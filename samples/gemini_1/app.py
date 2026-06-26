"""Google Gemini: a minimal generate call with the google-genai SDK.

Sends one prompt to a Gemini model and prints the reply.

Run:
    docker build -t aas-gemini .
    docker run --rm --env-file .env aas-gemini "Summarize Gemini in one line."
"""

import os
import sys

from dotenv import load_dotenv
from google import genai

# Load .env when running locally; in Docker the key comes from --env-file.
load_dotenv()

client = genai.Client()  # reads GEMINI_API_KEY
MODEL = os.environ.get("MODEL", "gemini-2.5-flash")


def main() -> None:
    prompt = " ".join(sys.argv[1:]) or "Summarize what Google Gemini offers in one sentence."

    resp = client.models.generate_content(model=MODEL, contents=prompt)
    print(resp.text)


if __name__ == "__main__":
    main()
