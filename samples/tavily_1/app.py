"""Minimal web-search agent: a LangGraph ReAct loop with a Tavily search tool.

Given a question only current data can answer — e.g. "today's USD->KRW exchange
rate" — the agent decides to call the `web_search` tool (Tavily), reads the
fresh results, and answers with the value and its sources. The model is routed
through LiteLLM, so the same code runs on Anthropic Claude, OpenAI, or Google
AI Studio (Gemini); pick one via the MODEL env var (see .env.sample).

Run:
    docker build -t aas-tavily .
    docker run --rm --env-file .env aas-tavily "오늘 USD/KRW 환율은?"
"""

import os
import sys

import litellm
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_litellm import ChatLiteLLM
from langchain_core.tools import tool
from tavily import TavilyClient

# Load .env when running locally; in Docker the keys come from --env-file.
load_dotenv()

# Drop params a given provider doesn't support, so the same code runs across
# OpenAI / Claude / Gemini.
litellm.drop_params = True

_tavily = TavilyClient(api_key=os.environ.get("TAVILY_API_KEY", ""))


@tool
def web_search(query: str) -> str:
    """Search the web for current information, returning a short answer with sources.

    Use this for anything past the model's training cutoff — prices, exchange
    rates, news, today's facts.
    """
    res = _tavily.search(query, search_depth="basic", include_answer=True, max_results=5)
    lines = []
    if res.get("answer"):
        lines.append(res["answer"])
    for r in res.get("results", []):
        lines.append(f"- {r['title']} ({r['url']})")
    return "\n".join(lines) or "No results."


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
    question = " ".join(sys.argv[1:]) or "오늘 USD/KRW 환율은?"

    # MODEL chooses the provider (claude-opus-4-8 / gpt-4o / gemini/gemini-2.5-flash).
    model = ChatLiteLLM(model=os.environ.get("MODEL", "claude-opus-4-8"), temperature=0)
    agent = create_agent(model, tools=[web_search])

    result = agent.invoke({"messages": [{"role": "user", "content": question}]})
    print(message_text(result["messages"][-1].content))


if __name__ == "__main__":
    main()
