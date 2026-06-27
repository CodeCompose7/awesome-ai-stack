# NeMo Guardrails — implementation sample

A tiny [NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails) sample: it
loads a Colang greeting rail and generates a reply, so the bot answers through a
fixed, approved message instead of free-form output. The main and embedding
models are both OpenAI, so no local model download is needed.

## Configure

```bash
cd samples/nemo-guardrails_1
cp .env.sample .env
# edit .env: set OPENAI_API_KEY (used for the main + embedding models)
```

## Run with Docker

```bash
cd samples/nemo-guardrails_1
docker build -t aas-nemo .
docker run --rm --env-file .env aas-nemo
```

## Run with Docker (in a devcontainer with DooD)

The foreground `docker run` may print nothing under Docker-outside-of-Docker —
run detached and follow the logs:

```bash
docker logs -f "$(docker run -d --env-file .env aas-nemo)"
```

## Run locally

```bash
cd samples/nemo-guardrails_1
pip install -r requirements.txt
python app.py
```

---

## Example run

> The greeting rail maps the user's "hi there" to a fixed bot message, so the
> reply is the same every run:

```text
bot: Hello! I'm a guardrailed assistant — I only respond through approved rails.
```
