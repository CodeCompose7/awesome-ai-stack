# DeepEval — implementation sample

A tiny [DeepEval](https://deepeval.com/docs) sample: it scores an answer with the
Answer Relevancy metric (LLM-as-judge).

## Configure

```bash
cd samples/deepeval_1
cp .env.sample .env
# edit .env: set OPENAI_API_KEY (used as the judge model)
```

## Run with Docker

```bash
cd samples/deepeval_1
docker build -t aas-deepeval .
docker run --rm --env-file .env aas-deepeval
```

## Run with Docker (in a devcontainer with DooD)

The foreground `docker run` may print nothing under Docker-outside-of-Docker —
run detached and follow the logs:

```bash
docker logs -f "$(docker run -d --env-file .env aas-deepeval)"
```

## Run locally

```bash
cd samples/deepeval_1
pip install -r requirements.txt
python app.py
```

---

## Example run

> Scores use an LLM judge, so the score and reason vary slightly run to run. One
> run with `gpt-4o-mini`:

```text
answer_relevancy: 1.00
reason: The score is 1.00 because the response directly addresses the question about the programming language of Qdrant without any irrelevant statements.
```
