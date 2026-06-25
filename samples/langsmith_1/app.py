"""LangSmith: trace a Claude call to LangSmith, then read the run back.

`@traceable` wraps the model call so each invocation shows up as a run in
LangSmith (a hosted SaaS). After the call we use the SDK to fetch the run and
print it — proving the trace landed, not just that the call didn't error.

Run:
    docker build -t aas-langsmith .
    docker run --rm --env-file .env aas-langsmith "How do I reset my password?"
"""

import os
import sys
import time

from anthropic import Anthropic
from dotenv import load_dotenv
from langsmith import Client, traceable
from langsmith.run_helpers import get_current_run_tree

load_dotenv()

MODEL = os.environ.get("MODEL", "claude-opus-4-8")
PROJECT = os.environ.get("LANGSMITH_PROJECT", "default")

anthropic = Anthropic()  # reads ANTHROPIC_API_KEY
ls = Client()  # reads LANGSMITH_API_KEY


@traceable(run_type="chain", name="plan")
def plan(question: str) -> str:
    resp = anthropic.messages.create(
        model=MODEL, max_tokens=256, messages=[{"role": "user", "content": question}]
    )
    # Stash the run id so we can read this exact run back afterwards.
    run = get_current_run_tree()
    if run is not None:
        plan.last_run_id = str(run.id)
    return resp.content[0].text


def fetch_run(run_id: str):
    """Tracing is async, so poll until the run is queryable and finished."""
    for _ in range(30):
        try:
            run = ls.read_run(run_id)
            if run.end_time is not None:
                return run
        except Exception:
            pass
        time.sleep(2)
    return None


def main() -> None:
    question = " ".join(sys.argv[1:]) or "How do I reset my password?"

    answer = plan(question)
    print("model says:", answer)

    ls.flush()  # push buffered traces before we read them back

    run_id = getattr(plan, "last_run_id", None)
    print("\nreading the run back from LangSmith ...")
    run = fetch_run(run_id) if run_id else None
    if run is None:
        print("run not queryable yet (tracing is async); check https://smith.langchain.com")
        return
    print(f"  run id:  {run.id}")
    print(f"  name:    {run.name}")
    print(f"  inputs:  {run.inputs}")
    print(f"  outputs: {run.outputs}")
    print(f"  url:     {ls.get_run_url(run=run)}")


if __name__ == "__main__":
    main()
