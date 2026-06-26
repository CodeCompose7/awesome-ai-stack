# CrewAI — a one-agent crew

A tiny [CrewAI](https://www.crewai.com) script: it defines an agent (role +
goal) and a task, groups them in a Crew, and runs `kickoff`.

## Configure

```bash
cd samples/crewai_1
cp .env.sample .env
# edit .env: set ANTHROPIC_API_KEY
```

CrewAI 1.x uses **native model providers**, so this sample installs
`crewai[anthropic]` and defaults to `anthropic/claude-opus-4-8`. To use another
provider, add its extra (e.g. `crewai[openai]`) and change `MODEL`. `.env` is
gitignored — only `.env.sample` is committed.

## Run with Docker

```bash
cd samples/crewai_1
docker build -t aas-crewai .
docker run --rm --env-file .env aas-crewai "CrewAI"
```

## Run with Docker (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the foreground `docker run` above often prints nothing and exits 0 — but the run
itself succeeds. The script runs to completion and Docker captures all of its
output; only the live **attached** stream drops it over the VM boundary. Run
**detached** and follow the logs instead:

```bash
cd samples/crewai_1
docker build -t aas-crewai .
docker logs -f "$(docker run -d --env-file .env aas-crewai "CrewAI")"
```

## Run locally

```bash
cd samples/crewai_1
pip install -r requirements.txt
python app.py "CrewAI"
```

`python-dotenv` loads `.env` automatically.

---

## Example run

> Output varies by model and run — LLMs are non-deterministic, so the wording
> differs each time. Below is one run with `anthropic/claude-opus-4-8`.

```text
CrewAI is an open-source framework for orchestrating multiple AI agents that
collaborate as a coordinated team to automate complex tasks.
```
