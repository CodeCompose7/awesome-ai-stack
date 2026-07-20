"""Langfuse: trace one LLM call into a self-hosted Langfuse, then read it back.

The bundled docker-compose starts a full Langfuse stack and bootstraps a project
with fixed API keys. This app wraps a Claude call in a Langfuse generation span,
flushes it, then queries the Langfuse API until the trace shows up — proving the
round trip end to end (not just "it didn't error").

Run (with the bundled Langfuse):
    docker compose up --build
"""

import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request

from anthropic import Anthropic
from dotenv import load_dotenv
from langfuse import Langfuse

load_dotenv()

HOST = os.environ.get("LANGFUSE_HOST", "http://localhost:3000")
PUBLIC = os.environ["LANGFUSE_PUBLIC_KEY"]
SECRET = os.environ["LANGFUSE_SECRET_KEY"]
MODEL = os.environ.get("MODEL", "claude-opus-4-8")


def _get(path: str):
    auth = base64.b64encode(f"{PUBLIC}:{SECRET}".encode()).decode()
    req = urllib.request.Request(f"{HOST}{path}", headers={"Authorization": f"Basic {auth}"})
    with urllib.request.urlopen(req, timeout=10) as r:
        return r.status, json.load(r)


def wait_until_ready(seconds: int = 300) -> None:
    """Langfuse runs DB migrations on first boot — wait for it to come up."""
    for _ in range(seconds):
        try:
            req = urllib.request.Request(f"{HOST}/api/public/health")
            with urllib.request.urlopen(req, timeout=5) as r:
                if r.status == 200:
                    return
        except (urllib.error.URLError, OSError):
            pass
        time.sleep(1)
    raise SystemExit(f"Langfuse did not become ready at {HOST}")


def fetch_latest_trace():
    """Ingestion is async (worker -> ClickHouse), so poll for the trace."""
    for _ in range(30):
        _, data = _get("/api/public/traces?limit=1")
        if data.get("data"):
            return data["data"][0]
        time.sleep(2)
    return None


def main() -> None:
    question = " ".join(sys.argv[1:]) or "Summarize what Langfuse does in one sentence."

    print(f"waiting for Langfuse at {HOST} ...")
    wait_until_ready()

    langfuse = Langfuse()  # reads LANGFUSE_HOST / _PUBLIC_KEY / _SECRET_KEY
    client = Anthropic()  # reads ANTHROPIC_API_KEY

    # Wrap the model call in a generation span so it lands as a trace in Langfuse.
    with langfuse.start_as_current_observation(
        as_type="generation", name="plan", model=MODEL, input=question
    ) as gen:
        resp = client.messages.create(
            model=MODEL, max_tokens=256, messages=[{"role": "user", "content": question}]
        )
        answer = resp.content[0].text
        gen.update(
            output=answer,
            usage_details={"input": resp.usage.input_tokens, "output": resp.usage.output_tokens},
        )

    langfuse.flush()
    print("model says:", answer)

    print("\nreading the trace back from Langfuse ...")
    trace = fetch_latest_trace()
    if trace is None:
        print(f"trace not ingested yet (it is async) — check the UI at {HOST}")
        return
    print(f"  trace id: {trace['id']}")
    print(f"  name:     {trace.get('name')}")
    print(f"  input:    {trace.get('input')}")
    print(f"  output:   {trace.get('output')}")
    print(f"  UI:       {HOST}/project/{os.environ.get('LANGFUSE_PROJECT_ID', '')}/traces/{trace['id']}")


if __name__ == "__main__":
    main()
