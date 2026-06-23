"""Minimal LangGraph agent: a tool-using ReAct loop powered by any LiteLLM model.

The agent is given two small tools and decides—via LangGraph's prebuilt ReAct
graph—when to call them while answering the question. The model is routed through
LiteLLM, so the same code works with Anthropic Claude, OpenAI, or Google AI
Studio (Gemini); pick one via the MODEL env var (see .env.sample).

Run:
    docker build -t aas-langgraph .
    docker run --rm --env-file .env aas-langgraph \
        "What is 24 * 7, and is the result prime?"
"""

import os
import sys

import litellm
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_litellm import ChatLiteLLM
from langchain_core.tools import tool

# Load .env when running locally; in Docker the keys come from --env-file.
load_dotenv()

# Drop params a given provider doesn't support (e.g. some Claude models reject
# temperature != 1), so the same code runs across OpenAI / Claude / Gemini.
litellm.drop_params = True


@tool
def multiply(a: int, b: int) -> int:
    """Multiply two integers."""
    return a * b


@tool
def is_prime(n: int) -> bool:
    """Return True if n is a prime number."""
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True


def main() -> None:
    question = " ".join(sys.argv[1:]) or "What is 24 * 7, and is the result prime?"

    # MODEL chooses the provider (claude-opus-4-8 / gpt-4o / gemini/gemini-2.5-flash).
    model = ChatLiteLLM(model=os.environ.get("MODEL", "claude-opus-4-8"), temperature=0)
    agent = create_agent(model, tools=[multiply, is_prime])

    result = agent.invoke({"messages": [{"role": "user", "content": question}]})
    print(result["messages"][-1].content)


if __name__ == "__main__":
    main()
