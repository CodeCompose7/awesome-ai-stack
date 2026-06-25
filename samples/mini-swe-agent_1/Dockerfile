# Minimal image for the mini-SWE-agent sample.
FROM python:3.13-slim

# Stream stdout/stderr unbuffered so the agent's steps appear live.
ENV PYTHONUNBUFFERED=1

# Some providers (e.g. Gemini) have no price registered in LiteLLM; without this
# mini-SWE-agent's cost tracking would raise instead of running.
ENV MSWEA_COST_TRACKING=ignore_errors

# Silence the package's import-time banner (version + v2 migration notice) so the
# agent's output starts clean. It is just an informational notice, not a warning.
ENV MSWEA_SILENT_STARTUP=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

# Provide your config at run time (.env is NOT baked into the image):
#   docker run --rm --env-file .env aas-mini-swe-agent "<task>"
ENTRYPOINT ["python", "app.py"]
