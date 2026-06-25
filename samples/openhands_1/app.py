"""OpenHands: an autonomous coding agent on the OpenHands Agent SDK.

OpenHands runs a real read–edit–run loop. This sample uses the SDK's *local*
workspace, so the agent runs its terminal + file-edit tools in this container —
no nested Docker sandbox — which keeps it to a single headless run.

The model is routed through LiteLLM via LLM_MODEL, so the same code works with
Anthropic Claude, OpenAI, or any LiteLLM-supported provider.

Run:
    docker build -t aas-openhands .
    docker run --rm --env-file .env aas-openhands \
        "Create result.txt with the result of 2 + 2, then read it back."
"""

import os
import sys

from openhands.sdk import LLM, Conversation
from openhands.tools.preset.default import get_default_agent
from pydantic import SecretStr

DEFAULT_TASK = (
    "Create result.txt containing the result of 2 + 2, then read it back "
    "and tell me the value."
)


def main() -> None:
    task = " ".join(sys.argv[1:]) or DEFAULT_TASK

    llm = LLM(
        usage_id="agent",
        model=os.environ.get("LLM_MODEL", "anthropic/claude-opus-4-8"),
        api_key=SecretStr(os.environ.get("LLM_API_KEY", "")),
        # claude-opus-4-8 uses a newer thinking API than this OpenHands/LiteLLM
        # build emits, so disable extended thinking to stay compatible.
        reasoning_effort=None,
    )

    # cli_mode=True keeps the terminal + file-editor tools and drops the browser.
    agent = get_default_agent(llm=llm, cli_mode=True)

    # A local workspace runs actions in this container — no nested Docker sandbox.
    workspace = os.environ.get("WORKSPACE", "/workspace")
    conversation = Conversation(agent=agent, workspace=workspace)
    conversation.send_message(task)
    conversation.run()


if __name__ == "__main__":
    main()
