"""Arize Phoenix: trace an LLM call into a self-hosted Phoenix, then read it back.

The bundled docker-compose runs a Phoenix server. This app registers
OpenTelemetry tracing pointed at it, makes one LiteLLM call (auto-instrumented),
then queries Phoenix for the spans — proving the round trip, not just that the
call didn't error.

Run (with the bundled Phoenix):
    docker compose up --build
"""

import os
import sys
import time
import urllib.error
import urllib.request

from dotenv import load_dotenv
from phoenix.client import Client
from phoenix.otel import register

load_dotenv()

ENDPOINT = os.environ.get("PHOENIX_COLLECTOR_ENDPOINT", "http://localhost:6006")
PROJECT = "aas-demo"
MODEL = os.environ.get("MODEL", "anthropic/claude-opus-4-8")


def wait_until_ready(seconds: int = 120) -> None:
    for _ in range(seconds):
        try:
            with urllib.request.urlopen(ENDPOINT, timeout=5) as r:
                if r.status < 500:
                    return
        except (urllib.error.URLError, OSError):
            pass
        time.sleep(1)
    raise SystemExit(f"Phoenix not ready at {ENDPOINT}")


def main() -> None:
    question = " ".join(sys.argv[1:]) or "Summarize Arize Phoenix in one sentence."

    print(f"waiting for Phoenix at {ENDPOINT} ...")
    wait_until_ready()

    # Send OpenTelemetry spans to Phoenix; auto_instrument patches LiteLLM.
    tracer_provider = register(
        project_name=PROJECT,
        endpoint=f"{ENDPOINT}/v1/traces",
        auto_instrument=True,
    )

    from litellm import completion

    resp = completion(model=MODEL, messages=[{"role": "user", "content": question}])
    print("model says:", resp.choices[0].message.content)

    tracer_provider.force_flush()  # push buffered spans before we query

    print("\nreading spans back from Phoenix ...")
    client = Client(base_url=ENDPOINT)
    for _ in range(20):
        try:
            df = client.spans.get_spans_dataframe(project_name=PROJECT)
        except Exception:
            df = None
        if df is not None and len(df):
            names = sorted(df["name"].tolist()) if "name" in df.columns else []
            print(f"  traced {len(df)} span(s): {names}")
            print(f"  UI: {ENDPOINT}")
            return
        time.sleep(2)
    print(f"spans not queryable yet (ingestion is async) — check the UI at {ENDPOINT}")


if __name__ == "__main__":
    main()
