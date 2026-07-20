"""LangGraph from scratch: a ReAct loop built with the StateGraph API + streaming.

Where langgraph_1 uses the prebuilt `create_agent`, this example wires the graph
by hand — an agent node, a tool node, and a conditional edge that loops until the
model stops requesting tools — and streams each step so you can watch the loop.

The model is routed through LiteLLM, so the same code works with Anthropic
Claude, OpenAI, or Google AI Studio (Gemini); pick one via MODEL (see .env.sample).

Run:
    docker build -t aas-langgraph2 .
    docker run --rm --env-file .env aas-langgraph2 \
        "How many times does the letter r appear in strawberry? Show it uppercased."
"""

import os
import sys
from typing import Annotated, TypedDict

import litellm
from dotenv import load_dotenv
from langchain_core.messages import BaseMessage, HumanMessage
from langchain_litellm import ChatLiteLLM
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode

from tools import TOOLS

# Load .env when running locally; in Docker the keys come from --env-file.
load_dotenv()

# Drop params a given provider doesn't support, so one codebase runs across
# OpenAI / Claude / Gemini.
litellm.drop_params = True


DEFAULT_QUESTION = (
    "How many times does the letter r appear in strawberry? Show it uppercased."
)


class State(TypedDict):
    # `add_messages` appends new messages to the list instead of overwriting it.
    messages: Annotated[list[BaseMessage], add_messages]


def build_model():
    """The provider-routed chat model with the tools bound to it."""
    # MODEL chooses the provider (claude-opus-4-8 / gpt-4o / gemini/gemini-2.5-flash).
    model = ChatLiteLLM(
        model=os.environ.get("MODEL", "claude-opus-4-8"),
        temperature=0,
    )
    return model.bind_tools(TOOLS)


def should_continue(state: State) -> str:
    """Conditional edge: run tools if the model asked for them, otherwise stop."""
    last = state["messages"][-1]
    return "tools" if getattr(last, "tool_calls", None) else "end"


def build_graph(model):
    """Wire the ReAct loop explicitly: agent -> (tools -> agent)* -> end."""

    # Agent node: ask the model what to do next given the conversation so far.
    def agent(state: State) -> State:
        return {"messages": [model.invoke(state["messages"])]}

    graph = StateGraph(State)
    graph.add_node("agent", agent)
    graph.add_node("tools", ToolNode(TOOLS))
    graph.add_edge(START, "agent")
    graph.add_conditional_edges(
        "agent", should_continue, {"tools": "tools", "end": END}
    )
    graph.add_edge("tools", "agent")  # after running tools, think again
    return graph.compile()


def parse_question(argv: list[str]) -> str:
    """The CLI arguments joined into one question, or the default demo prompt."""
    return " ".join(argv) or DEFAULT_QUESTION


def stream_answer(graph, question: str) -> BaseMessage | None:
    """Stream each step and print it, returning the final message.

    stream_mode="values" yields the full state after each node, so we can watch
    the loop unfold: agent -> tools -> agent -> ... -> final answer.
    """
    final: BaseMessage | None = None
    for step in graph.stream(
        {"messages": [HumanMessage(question)]}, stream_mode="values"
    ):
        final = step["messages"][-1]
        final.pretty_print()
    return final


def message_text(content) -> str:
    """Flatten an assistant message's content to plain text.

    Cloud models return a string; a local thinking model (via Ollama) returns a
    list of blocks like [{type: thinking}, {type: text}], so keep only the text.
    """
    if isinstance(content, list):
        return "".join(
            part.get("text", "")
            for part in content
            if isinstance(part, dict) and part.get("type") == "text"
        )
    return content


def main() -> None:
    question = parse_question(sys.argv[1:])
    graph = build_graph(build_model())
    final = stream_answer(graph, question)

    if final is not None:
        print("\n=== answer ===")
        print(message_text(final.content))


if __name__ == "__main__":
    main()
