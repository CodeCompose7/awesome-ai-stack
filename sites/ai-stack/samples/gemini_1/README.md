# Google Gemini — a minimal generate call

A tiny [Gemini](https://ai.google.dev/gemini-api/docs) script: it sends one
prompt to a Gemini model with the `google-genai` SDK and prints the reply.

## Configure

```bash
cd samples/gemini_1
cp .env.sample .env
# edit .env: set GEMINI_API_KEY (and optionally MODEL)
```

Get a key at [aistudio.google.com](https://aistudio.google.com) (free tier).
`MODEL` defaults to `gemini-2.5-flash`. `.env` is gitignored — only `.env.sample`
is committed.

## Run with Docker

```bash
cd samples/gemini_1
docker build -t aas-gemini .
docker run --rm --env-file .env aas-gemini "Summarize Gemini in one line."
```

## Run with Docker (in a devcontainer with DooD)

In a dev container that talks to the host Docker daemon (Docker-outside-of-Docker),
the foreground `docker run` above often prints nothing and exits 0 — but the run
itself succeeds. The script runs to completion and Docker captures all of its
output; only the live **attached** stream drops it over the VM boundary. You can
confirm this: `docker logs` on the same container shows the full output, the
container exits 0, and it is **not** an OOM. Run **detached** and follow the logs
instead:

```bash
cd samples/gemini_1
docker build -t aas-gemini .
docker logs -f "$(docker run -d --env-file .env aas-gemini \
  "Summarize Gemini in one line.")"
```

## Run locally

```bash
cd samples/gemini_1
pip install -r requirements.txt
python app.py "Summarize Gemini in one line."
```

`python-dotenv` loads `.env` automatically.

---

## Example run

> Output varies by model and run — LLMs are non-deterministic, so the wording
> differs each time. Below is one run with `gemini-2.5-flash`.

```text
Google Gemini is Google's multimodal AI model designed to understand, process,
and generate various forms of information, including text, images, audio, and
video.
```
