# OpenHands — an autonomous coding agent (local workspace)

A headless [OpenHands](https://www.all-hands.dev) run on the OpenHands Agent
SDK: it gives the agent terminal + file-editor tools and a task, then runs the
read–edit–run loop until done. It uses the SDK's **local workspace**, so the
agent acts inside this container — **no nested Docker sandbox** — and the whole
thing is a single `docker run`.

> **Heavy image.** OpenHands pulls a large dependency set (playwright, jupyter,
> …), so the image is several GB and the first build is slow.

## Configure

```bash
cd samples/openhands_1
cp .env.sample .env
# edit .env: set LLM_MODEL and LLM_API_KEY
```

`LLM_MODEL` is a LiteLLM-style name, so any provider works:

| Provider          | `LLM_MODEL`                 | `LLM_API_KEY`         |
| ----------------- | --------------------------- | --------------------- |
| Anthropic Claude  | `anthropic/claude-opus-4-8` | your Anthropic key    |
| OpenAI            | `openai/gpt-4o`             | your OpenAI key       |

`.env` is gitignored — only `.env.sample` is committed.

## Run with Docker

```bash
cd samples/openhands_1
docker build -t aas-openhands .
docker run --rm --env-file .env aas-openhands \
  "Create result.txt with the result of 2 + 2, then read it back."
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
cd samples/openhands_1
docker build -t aas-openhands .
docker logs -f "$(docker run -d --env-file .env aas-openhands \
  "Create result.txt with the result of 2 + 2, then read it back.")"
```

(This sample uses the SDK's local workspace, so it does **not** spawn a second
container — unlike OpenHands' default Docker runtime.)

## Run locally

```bash
cd samples/openhands_1
pip install -r requirements.txt
python app.py "Create result.txt with the result of 2 + 2, then read it back."
```

## Notes

- **`reasoning_effort=None`** in `app.py`: `claude-opus-4-8` uses a newer thinking
  API than this OpenHands/LiteLLM build sends, so extended thinking is disabled to
  stay compatible. Other models (e.g. `openai/gpt-4o`) work unchanged.

---

## Example run

> Output varies by model and run — LLMs are non-deterministic, so the exact
> wording (and the agent's steps) differ each time. Below is one run with
> `anthropic/claude-opus-4-8`.

```text
Message from User ──────────────────────────────────────────────
Create result.txt with the result of 2 + 2, then read it back.

Agent Action ───────────────────────────────────────────────────
$ echo $((2 + 2)) > /workspace/result.txt && cat /workspace/result.txt

Observation ─────────────────────────────────────────────────────
Tool: terminal
Result:
4
✅ Exit code: 0

Message from Agent ──────────────────────────────────────────────
I created `/workspace/result.txt` containing the result of 2 + 2, then read it
back. The value is **4**.
```
