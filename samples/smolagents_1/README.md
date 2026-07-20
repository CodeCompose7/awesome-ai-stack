# smolagents — implementation sample

A tiny [smolagents](https://huggingface.co/docs/smolagents) sample: it runs a
**code agent** that writes and executes Python to solve the task. The model is
routed through LiteLLM, so any provider works via `MODEL`.

## Configure

```bash
cd samples/smolagents_1
cp .env.sample .env
# edit .env: set ANTHROPIC_API_KEY (or swap MODEL + the matching key)
```

## Run with Docker

```bash
cd samples/smolagents_1
docker build -t aas-smolagents .
docker run --rm --env-file .env aas-smolagents "Compute 2 ** 10 + 5 in Python and return the number."
```

## Run with Docker (in a devcontainer with DooD)

The foreground `docker run` may print nothing under Docker-outside-of-Docker —
run detached and follow the logs:

```bash
docker logs -f "$(docker run -d --env-file .env aas-smolagents "Compute 2 ** 10 + 5 in Python and return the number.")"
```

## Run locally

```bash
cd samples/smolagents_1
pip install -r requirements.txt
python app.py "Compute 2 ** 10 + 5 in Python and return the number."
```

---

## Example run

> The agent prints its reasoning steps; the final line is the answer. Wording
> varies, but the computed value is stable. One run with `claude-opus-4-8`:

```text
result: 1029
```
