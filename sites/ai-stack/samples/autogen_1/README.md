# AutoGen — implementation sample

A tiny [AutoGen](https://microsoft.github.io/autogen/stable/) (AgentChat) sample:
a single assistant agent runs one task.

> Note: AutoGen is in maintenance mode; Microsoft directs new work to the
> Microsoft Agent Framework.

## Configure

```bash
cd samples/autogen_1
cp .env.sample .env
# edit .env: set OPENAI_API_KEY (and optionally MODEL)
```

## Run with Docker

```bash
cd samples/autogen_1
docker build -t aas-autogen .
docker run --rm --env-file .env aas-autogen "Say hello in one short sentence."
```

## Run with Docker (in a devcontainer with DooD)

The foreground `docker run` may print nothing under Docker-outside-of-Docker —
run detached and follow the logs:

```bash
docker logs -f "$(docker run -d --env-file .env aas-autogen "Say hello in one short sentence.")"
```

## Run locally

```bash
cd samples/autogen_1
pip install -r requirements.txt
python app.py "Say hello in one short sentence."
```

---

## Example run

> Output varies by model and run — LLMs are non-deterministic. One run with
> `gpt-4o-mini`:

```text
Hello!
```
