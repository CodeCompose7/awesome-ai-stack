# Image for the code-sandbox agent. The agent shells out to `docker` to run
# model-written code in a *sibling* container, so this image ships the Docker
# CLI and you mount the host's Docker socket at run time (Docker-out-of-Docker).
FROM python:3.13-slim

# Stream stdout/stderr unbuffered so the agent's output appears live.
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# The Docker CLI *client* — the agent calls it to spawn sandbox containers on the
# mounted host daemon. Debian's `docker.io` package isn't on every base (e.g.
# trixie), so download just the static client binary with Python + tar (both
# already in the image) — no apt, base-independent. The download is verified
# against a pinned sha256 per architecture before it's installed (bump these
# together with the version); `docker --version` fails the build if it didn't land.
RUN python -c "import hashlib, platform, urllib.request; \
sums = {'x86_64': '4f798b3ee1e0140eab5bf30b0edc4e84f4cdb53255a429dc3bbae9524845d640', \
        'aarch64': 'e6b53725a73763ab3f988c73f8772eaed429754c1a579db5ff11f21990fd1817'}; \
arch = platform.machine(); \
urllib.request.urlretrieve('https://download.docker.com/linux/static/stable/' + arch + '/docker-27.5.1.tgz', '/tmp/docker.tgz'); \
digest = hashlib.sha256(open('/tmp/docker.tgz', 'rb').read()).hexdigest(); \
assert digest == sums[arch], 'docker.tgz sha256 mismatch for ' + arch + ': ' + digest" \
    && tar -xzf /tmp/docker.tgz -C /usr/local/bin --strip-components=1 docker/docker \
    && rm /tmp/docker.tgz \
    && docker --version

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

# Mount the host Docker socket so the agent can spawn sibling sandbox containers
# (.env is NOT baked into the image):
#   docker run --rm --env-file .env \
#     -v /var/run/docker.sock:/var/run/docker.sock aas-code-sandbox "<task>"
ENTRYPOINT ["python", "app.py"]
