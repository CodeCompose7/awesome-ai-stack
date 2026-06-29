"""Minimal web-scraping agent: a LangGraph ReAct loop with a Firecrawl scrape tool.

Given a task that needs the contents of a web page — e.g. "read this docs page
and summarize it" — the agent calls the `scrape` tool (Firecrawl), which fetches
the page and returns clean Markdown, then reads it and answers. The model is
routed through LiteLLM, so the same code runs on Anthropic Claude, OpenAI, or
Google AI Studio (Gemini); pick one via the MODEL env var (see .env.sample).

Run:
    docker build -t aas-firecrawl .
    docker run --rm --env-file .env aas-firecrawl \
        "https://docs.firecrawl.dev 를 읽고 핵심 기능 3가지만 요약해줘"
"""

import os
import sys

import litellm
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_litellm import ChatLiteLLM
from langchain_core.tools import tool
from firecrawl import FirecrawlApp

# Load .env when running locally; in Docker the keys come from --env-file.
load_dotenv()

# Drop params a given provider doesn't support, so the same code runs across
# OpenAI / Claude / Gemini.
litellm.drop_params = True

_firecrawl = FirecrawlApp(api_key=os.environ.get("FIRECRAWL_API_KEY", ""))


@tool
def scrape(url: str) -> str:
    """Fetch a web page and return its content as clean Markdown.

    Use this to read what's actually behind a URL — docs, articles, anything the
    model can't see on its own. Pass a single absolute URL.
    """
    res = _firecrawl.scrape_url(url, formats=["markdown"])
    md = getattr(res, "markdown", None)
    if md is None and isinstance(res, dict):  # older SDKs return a dict
        md = res.get("markdown") or res.get("data", {}).get("markdown")
    # Cap the length so a long page doesn't blow up the prompt.
    return (md or "")[:6000] or "No content."


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
    question = " ".join(sys.argv[1:]) or "https://docs.firecrawl.dev 를 읽고 핵심 기능 3가지만 요약해줘"

    # MODEL chooses the provider (claude-opus-4-8 / gpt-4o / gemini/gemini-2.5-flash).
    model = ChatLiteLLM(model=os.environ.get("MODEL", "claude-opus-4-8"), temperature=0)
    agent = create_agent(model, tools=[scrape])

    result = agent.invoke({"messages": [{"role": "user", "content": question}]})
    print(message_text(result["messages"][-1].content))


if __name__ == "__main__":
    main()
