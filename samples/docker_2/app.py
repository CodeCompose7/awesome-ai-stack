"""Code-sandbox agent without LangChain: LiteLLM + LangGraph wired by hand.

Same behavior as docker_1 — a ReAct loop with a run_python tool that executes
model-written code inside a throwaway Docker container — but the only agent
dependencies are litellm (model routing) and langgraph (the loop runtime).
The tool schema is hand-written JSON, tool calls are dispatched by hand, and
the state is a plain list of OpenAI-format message dicts.

The model is routed through LiteLLM, so the same code runs on Anthropic
Claude, OpenAI, or Google AI Studio (Gemini); pick one via MODEL (see .env.sample).

Run (on a host with Docker):
    docker pull python:3.12-slim          # the sandbox image, pulled once
    pip install -r requirements.txt
    python app.py "What is the 30th Fibonacci number?"
"""

import json
import os
import subprocess
import sys
from typing import TypedDict

import litellm
from dotenv import load_dotenv
from langgraph.graph import END, START, StateGraph

# Load .env when running locally; in Docker the keys come from --env-file.
load_dotenv()

# Drop params a given provider doesn't support, so the same code runs across
# OpenAI / Claude / Gemini.
litellm.drop_params = True

# The throwaway image the sandboxed code runs in. Pre-pull it once:
#   docker pull python:3.12-slim
SANDBOX_IMAGE = os.environ.get("SANDBOX_IMAGE", "python:3.12-slim")

# The tool schema, written by hand. With LangChain this comes free from @tool
# and the docstring; here the description IS the docs the model reads to decide
# when to reach for code.
RUN_PYTHON = {
    "type": "function",
    "function": {
        "name": "run_python",
        "description": (
            "Run a snippet of Python and return its stdout/stderr. "
            "The code executes in an isolated, throwaway Docker container — "
            "no network, capped memory/CPU — so it can't touch the host. "
            "Use print() to surface results, and stick to the standard library."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "code": {"type": "string", "description": "Python source to run."}
            },
            "required": ["code"],
        },
    },
}


def run_python(code: str) -> str:
    """Execute `code` in a throwaway container and return its output. Identical
    to docker_1 — the sandbox doesn't care which framework called it."""
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


class State(TypedDict):
    # Plain OpenAI-format message dicts — no message classes, no reducer.
    messages: list


def call_model(state: State) -> State:
    """Agent node: one LiteLLM call with the conversation so far + the tool."""
    resp = litellm.completion(
        model=os.environ.get("MODEL", "claude-opus-4-8"),
        messages=state["messages"],
        tools=[RUN_PYTHON],
        temperature=0,
    )
    msg = resp.choices[0].message.model_dump()
    # Drop null fields (e.g. function_call) so the resent message stays clean.
    msg = {k: v for k, v in msg.items() if v is not None}
    return {"messages": state["messages"] + [msg]}


def call_tools(state: State) -> State:
    """Tool node: dispatch every requested call by hand and tag each result
    with its tool_call_id so the model can match answers to requests."""
    results = []
    for call in state["messages"][-1]["tool_calls"]:
        args = json.loads(call["function"]["arguments"] or "{}")
        if call["function"]["name"] == "run_python":
            output = run_python(args.get("code", ""))
        else:
            output = f"Error: unknown tool {call['function']['name']}"
        results.append({"role": "tool", "tool_call_id": call["id"], "content": output})
    return {"messages": state["messages"] + results}


def route(state: State) -> str:
    """Conditional edge: run tools if the model asked for them, otherwise stop."""
    return "tools" if state["messages"][-1].get("tool_calls") else "end"


def build_graph():
    """Wire the ReAct loop explicitly: model -> (tools -> model)* -> end."""
    graph = StateGraph(State)
    graph.add_node("model", call_model)
    graph.add_node("tools", call_tools)
    graph.add_edge(START, "model")
    graph.add_conditional_edges("model", route, {"tools": "tools", "end": END})
    graph.add_edge("tools", "model")  # after running tools, think again
    return graph.compile()


def message_text(content) -> str:
    """Flatten a message's content to plain text (cloud models return a string;
    some local models return a list of blocks)."""
    if isinstance(content, list):
        return "".join(
            part.get("text", "")
            for part in content
            if isinstance(part, dict) and part.get("type") == "text"
        )
    return content or ""


def main() -> None:
    question = " ".join(sys.argv[1:]) or "What is the 30th Fibonacci number? Use code."

    agent = build_graph()
    result = agent.invoke({"messages": [{"role": "user", "content": question}]})
    final = result["messages"][-1]
    answer = message_text(final.get("content")).strip()
    # Never exit silently: if the final message had no text, show the raw message
    # so a misrouted model or a swallowed tool error is visible.
    print(answer or f"[no text in the final message] {final!r}")


if __name__ == "__main__":
    main()
