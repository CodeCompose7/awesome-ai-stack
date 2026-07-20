# Image for the OpenHands sample. OpenHands pulls a large dependency set
# (playwright, jupyter, …), so this image is several GB — expect a slow first build.
FROM python:3.12-slim

# Stream stdout/stderr unbuffered so the agent's steps appear live.
ENV PYTHONUNBUFFERED=1

# Hide the SDK's import-time startup banner so the agent's output stays clean.
ENV OPENHANDS_SUPPRESS_BANNER=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

# The agent works here — a local workspace, not a nested Docker sandbox.
RUN mkdir -p /workspace
ENV WORKSPACE=/workspace

# Provide your config at run time (.env is NOT baked into the image):
#   docker run --rm --env-file .env aas-openhands "<task>"
ENTRYPOINT ["python", "app.py"]
