"""Minimal LangGraph agent: a tool-using ReAct loop powered by Claude.

The agent is given two small tools and decides—via LangGraph's prebuilt ReAct
graph—when to call them while answering the question.

Run:
    docker build -t aas-langgraph .
    docker run --rm -e ANTHROPIC_API_KEY=sk-ant-... aas-langgraph \
        "What is 24 * 7, and is the result prime?"
"""

import sys

from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent


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

    # Use the latest, most capable Claude model for the agent's reasoning.
    model = ChatAnthropic(model="claude-opus-4-8", temperature=0)
    agent = create_react_agent(model, tools=[multiply, is_prime])

    result = agent.invoke({"messages": [{"role": "user", "content": question}]})
    print(result["messages"][-1].content)


if __name__ == "__main__":
    main()
