# LangGraph — building the graph from scratch

Where [langgraph_1](../langgraph_1) uses the prebuilt `create_agent`, this
example wires the ReAct loop **by hand** with the [LangGraph](https://www.langchain.com/langgraph)
`StateGraph` API — an `agent` node, a `tools` node, and a conditional edge that
loops until the model stops requesting tools — then **streams** each step so you
can watch the reasoning unfold.

The model is routed through [LiteLLM](https://docs.litellm.ai/), so the same
code works with **Anthropic Claude**, **OpenAI**, or **Google AI Studio
(Gemini)** — just change `MODEL` in `.env`.

## The graph

```mermaid
flowchart LR
    START([START]) --> agent[agent]
    agent -->|tool calls?| tools[tools]
    agent -->|no| END([END])
    tools -->|loop back to agent| agent
```

`stream_mode="values"` emits the full state after every node, so the run prints
`agent → tools → agent → …` until the final answer.

## Configure

```bash
cd samples/langgraph_2
cp .env.sample .env
# edit .env: set MODEL and the matching provider key
```

`MODEL` picks the provider:

| Provider          | `MODEL` example           | Key in `.env`       |
| ----------------- | ------------------------- | ------------------- |
| Anthropic Claude  | `claude-opus-4-8`         | `ANTHROPIC_API_KEY` |
| OpenAI            | `gpt-4o`                  | `OPENAI_API_KEY`    |
| Google AI Studio  | `gemini/gemini-2.5-flash` | `GEMINI_API_KEY`    |
| Ollama (local)    | `ollama_chat/qwen3.5:9b`  | `OLLAMA_API_BASE`   |

`.env` is gitignored — only `.env.sample` is committed.

**Ollama (local models):** first pull the model on the host —
`ollama pull qwen3.5:9b` (or `ollama run qwen3.5:9b`). Then set
`MODEL=ollama_chat/qwen3.5:9b` and point `OLLAMA_API_BASE` at the server — no API key
needed. In a devcontainer with DooD the container reaches the host's Ollama at
`http://host.docker.internal:11434`; running locally use
`http://localhost:11434`. Tool-calling needs Ollama's chat endpoint, so use the `ollama_chat/` prefix shown above (not `ollama/`) — with `ollama/` the model returns empty output and no tool calls. The local model must also support tools (`gemma`, for one, does not).

## Run with Docker

```bash
cd samples/langgraph_2
docker build -t aas-langgraph2 .
docker run --rm --env-file .env aas-langgraph2 \
  "How many times does the letter r appear in strawberry? Show it uppercased."
```

## Run with Docker (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the foreground `docker run` above often prints nothing and exits 0 — but the run
itself succeeds. The agent runs to completion and Docker captures all of its
output; only the live **attached** stream drops it over the VM boundary. You can
confirm this: `docker logs` on the same container shows the full output, the
container exits 0, and it is **not** an OOM. Run **detached** and follow the logs
instead:

```bash
cd samples/langgraph_2
docker build -t aas-langgraph2 .
docker logs -f "$(docker run -d --env-file .env aas-langgraph2 \
  "How many times does the letter r appear in strawberry? Show it uppercased.")"
```

## Run locally

```bash
cd samples/langgraph_2
pip install -r requirements.txt
python app.py "How many times does the letter r appear in strawberry? Show it uppercased."
```

`python-dotenv` loads `.env` automatically. Get keys from
[Anthropic](https://console.anthropic.com/),
[OpenAI](https://platform.openai.com/api-keys), or
[Google AI Studio](https://aistudio.google.com/apikey).

---

## Example run

> Output varies by model and run — LLMs are non-deterministic, so the exact
> wording (and an agent's steps) differ each time. Below is one run with
> `claude-opus-4-8`.

```text
================================ Human Message =================================

How many times does the letter r appear in strawberry? Show it uppercased.
================================== Ai Message ==================================

I'll count the letter "r" in "strawberry" and show it uppercased.
Tool Calls:
  count_letter (toolu_01XSgSztFUZEggtCkxLYr7BF)
 Call ID: toolu_01XSgSztFUZEggtCkxLYr7BF
  Args:
    word: strawberry
    letter: r
  to_upper (toolu_01Jozend9wz6cpjoyjMFq9Xx)
 Call ID: toolu_01Jozend9wz6cpjoyjMFq9Xx
  Args:
    text: strawberry
================================= Tool Message =================================
Name: to_upper

STRAWBERRY
================================== Ai Message ==================================

The letter **r** appears **3 times** in "STRAWBERRY".

=== answer ===
The letter **r** appears **3 times** in "STRAWBERRY".
```
