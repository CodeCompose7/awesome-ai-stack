"""Anthropic Claude: a tool-using agent turn with the official SDK.

Claude decides when to call a tool; we run it and feed the result back as a
`tool_result`, looping until Claude produces a final text answer. That loop —
function calling plus feeding results back — is the core agentic pattern.

Run:
    docker build -t aas-anthropic-claude .
    docker run --rm --env-file .env aas-anthropic-claude "What should I wear in Seoul today?"
"""

import os
import sys

from anthropic import Anthropic
from dotenv import load_dotenv

# Load .env when running locally; in Docker the key comes from --env-file.
load_dotenv()

client = Anthropic()  # reads ANTHROPIC_API_KEY
MODEL = os.environ.get("MODEL", "claude-opus-4-8")

TOOLS = [
    {
        "name": "get_weather",
        "description": "Get the current weather for a city.",
        "input_schema": {
            "type": "object",
            "properties": {"city": {"type": "string"}},
            "required": ["city"],
        },
    }
]


def get_weather(city: str) -> str:
    # A real tool would call a weather API; here we return a canned value.
    return f"It is 22°C and sunny in {city}."


def main() -> None:
    question = " ".join(sys.argv[1:]) or "What should I wear in Seoul today?"
    messages = [{"role": "user", "content": question}]

    while True:
        resp = client.messages.create(
            model=MODEL, max_tokens=1024, tools=TOOLS, messages=messages
        )

        for block in resp.content:
            if block.type == "text":
                print(block.text)
            elif block.type == "tool_use":
                print(f"[tool call] {block.name}({block.input})")

        # Claude is done once it stops asking for a tool.
        if resp.stop_reason != "tool_use":
            break

        # Run each requested tool and send the results back to continue the loop.
        messages.append({"role": "assistant", "content": resp.content})
        results = []
        for block in resp.content:
            if block.type == "tool_use":
                output = get_weather(**block.input) if block.name == "get_weather" else "unknown tool"
                results.append(
                    {"type": "tool_result", "tool_use_id": block.id, "content": output}
                )
        messages.append({"role": "user", "content": results})


if __name__ == "__main__":
    main()
