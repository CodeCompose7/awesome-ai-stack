"""Minimal code-sandbox agent: a LangGraph ReAct loop with a run_python tool that
executes model-generated code inside a throwaway Docker container.

Give the agent a task that needs real computation — "what's the 30th Fibonacci
number?" — and it writes Python, calls run_python, and that code runs in an
isolated container (no network, capped CPU/memory, auto-removed), never on the
host. The model is routed through LiteLLM, so the same code runs on Anthropic
Claude, OpenAI, or Google AI Studio (Gemini); pick one via MODEL (see .env.sample).

Run (on a host with Docker):
    docker pull python:3.12-slim          # the sandbox image, pulled once
    pip install -r requirements.txt
    python app.py "What is the 30th Fibonacci number?"
"""

import os
import subprocess
import sys

import litellm
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_litellm import ChatLiteLLM
from langchain_core.tools import tool

# Load .env when running locally; in Docker the keys come from --env-file.
load_dotenv()

# Drop params a given provider doesn't support, so the same code runs across
# OpenAI / Claude / Gemini.
litellm.drop_params = True

# The throwaway image the sandboxed code runs in. Pre-pull it once:
#   docker pull python:3.12-slim
SANDBOX_IMAGE = os.environ.get("SANDBOX_IMAGE", "python:3.12-slim")


@tool
def run_python(code: str) -> str:
    """Run a snippet of Python and return its stdout/stderr.

    The code executes in an isolated, throwaway Docker container — no network,
    capped memory/CPU, auto-removed when it exits — so it can't touch the host.
    Use print() to surface results, and stick to the standard library.
    """
    try:
        proc = subprocess.run(
            [
                "docker", "run", "--rm", "-i",
                "--network", "none",      # no network: nothing leaves the box
                "--memory", "256m",       # memory cap
                "--cpus", "1",            # cpu cap
                "--pids-limit", "128",    # process cap (fork-bomb guard)
                "--user", "65534:65534",  # run as nobody, not root
                SANDBOX_IMAGE,
                "python", "-",            # read the program from stdin
            ],
            input=code,
            capture_output=True,
            text=True,
            timeout=30,                   # wall-clock guard
        )
    except subprocess.TimeoutExpired:
        return "Error: code timed out after 30s."
    except FileNotFoundError:
        return "Error: docker not found — run on a host with Docker available."

    out = (proc.stdout or "") + (proc.stderr or "")
    return out.strip()[:4000] or "(no output)"


def message_text(content) -> str:
    """Flatten an assistant message's content to plain text (cloud models return a
    string; some local models return a list of blocks)."""
    if isinstance(content, list):
        return "".join(
            part.get("text", "")
            for part in content
            if isinstance(part, dict) and part.get("type") == "text"
        )
    return content


def main() -> None:
    question = " ".join(sys.argv[1:]) or "What is the 30th Fibonacci number? Use code."

    # MODEL chooses the provider (claude-opus-4-8 / gpt-4o / gemini/gemini-2.5-flash).
    model = ChatLiteLLM(model=os.environ.get("MODEL", "claude-opus-4-8"), temperature=0)
    agent = create_agent(model, tools=[run_python])

    result = agent.invoke({"messages": [{"role": "user", "content": question}]})
    final = result["messages"][-1]
    answer = (message_text(final.content) or "").strip()
    # Never exit silently: if the final message had no text, show the raw message
    # so a misrouted model or a swallowed tool error is visible.
    print(answer or f"[no text in the final message] {final!r}")


if __name__ == "__main__":
    main()
