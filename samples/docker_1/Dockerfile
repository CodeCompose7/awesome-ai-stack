# Image for the code-sandbox agent. The agent shells out to `docker` to run
# model-written code in a *sibling* container, so this image ships the Docker
# CLI and you mount the host's Docker socket at run time (Docker-out-of-Docker).
FROM python:3.13-slim

# Stream stdout/stderr unbuffered so the agent's output appears live.
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# The Docker CLI client — the agent calls it to spawn sandbox containers.
RUN apt-get update \
    && apt-get install -y --no-install-recommends docker.io \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

# Mount the host Docker socket so the agent can spawn sibling sandbox containers
# (.env is NOT baked into the image):
#   docker run --rm --env-file .env \
#     -v /var/run/docker.sock:/var/run/docker.sock aas-code-sandbox "<task>"
ENTRYPOINT ["python", "app.py"]
