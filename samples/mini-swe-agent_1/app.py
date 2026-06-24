"""mini-SWE-agent: a ~100-line coding agent that works with plain shell commands.

The agent reads a task, runs a shell command in its environment, observes the
output, and loops until it submits a result — no special tools, just bash. The
model is routed through LiteLLM, so MODEL in `.env` picks the provider
(claude-opus-4-8 / gpt-4o / gemini/gemini-2.5-flash).

This mirrors mini-SWE-agent's own `hello_world` binding: a DefaultAgent driving
a LocalEnvironment with a text-based LiteLLM model.

Run:
    docker build -t aas-mini-swe-agent .
    docker run --rm --env-file .env aas-mini-swe-agent \
        "Print the result of 2 + 2 using a shell command, then submit."
"""

import os
import sys

import yaml
from dotenv import load_dotenv
from minisweagent import package_dir
from minisweagent.agents.default import DefaultAgent
from minisweagent.environments.local import LocalEnvironment
from minisweagent.models.litellm_textbased_model import LitellmTextbasedModel

# Load .env when running locally; in Docker the keys come from --env-file.
load_dotenv()


DEFAULT_TASK = "Print the result of 2 + 2 using a single shell command, then submit."


def main() -> None:
    task = " ".join(sys.argv[1:]) or DEFAULT_TASK

    # MODEL chooses the provider; LitellmTextbasedModel routes it through LiteLLM.
    model_name = os.environ.get("MODEL", "claude-opus-4-8")

    # Start from mini-SWE-agent's default agent config, but bound the demo.
    agent_config = yaml.safe_load((package_dir / "config" / "default.yaml").read_text())["agent"]
    agent_config["step_limit"] = 15

    # The default config asks the model to reply with a ```mswea_bash_command
    # fence, so pair it with the text-based model (not the tool-calling one).
    agent = DefaultAgent(
        LitellmTextbasedModel(model_name=model_name),
        LocalEnvironment(),
        **agent_config,
    )

    result = agent.run(task)

    # Show the loop unfold: skip the system + instructions (messages 0-1) and
    # print each step's thought/command and the observation it produced.
    for msg in agent.messages[2:]:
        content = msg.get("content", "")
        if isinstance(content, list):  # multimodal parts -> join the text
            content = " ".join(p.get("text", "") for p in content if isinstance(p, dict))
        if content.strip():
            print(f"\n--- {msg.get('role')} ---\n{content.strip()}")

    print(f"\n=== {result.get('exit_status', 'unknown')} ===")
    print(result.get("submission", ""))


if __name__ == "__main__":
    main()
