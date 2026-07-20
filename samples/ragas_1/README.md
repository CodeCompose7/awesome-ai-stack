# Ragas — implementation sample

A tiny [Ragas](https://docs.ragas.io) sample: it scores a RAG answer for
faithfulness and response relevancy, judged by an OpenAI model + embeddings.

## Configure

```bash
cd samples/ragas_1
cp .env.sample .env
# edit .env: set OPENAI_API_KEY (judge LLM + embeddings)
```

## Run with Docker

```bash
cd samples/ragas_1
docker build -t aas-ragas .
docker run --rm --env-file .env aas-ragas
```

## Run with Docker (in a devcontainer with DooD)

The foreground `docker run` may print nothing under Docker-outside-of-Docker —
run detached and follow the logs:

```bash
docker logs -f "$(docker run -d --env-file .env aas-ragas)"
```

## Run locally

```bash
cd samples/ragas_1
pip install -r requirements.txt
python app.py
```

---

## Example run

> Scores use an LLM judge, so they vary slightly run to run. One run with
> `gpt-4o-mini`:

```text
{'faithfulness': 1.0000, 'answer_relevancy': 0.9701}
```
