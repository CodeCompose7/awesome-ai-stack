"""AutoGen (AgentChat): a single assistant agent runs one task.

Run:
    docker build -t aas-autogen .
    docker run --rm --env-file .env aas-autogen "Say hello in one short sentence."
"""

import asyncio
import os
import sys

from dotenv import load_dotenv
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

load_dotenv()

MODEL = os.environ.get("MODEL", "gpt-4o-mini")


async def main() -> None:
    prompt = " ".join(sys.argv[1:]) or "Say hello in one short sentence."
    agent = AssistantAgent("assistant", model_client=OpenAIChatCompletionClient(model=MODEL))
    result = await agent.run(task=prompt)
    print(result.messages[-1].content)


if __name__ == "__main__":
    asyncio.run(main())
