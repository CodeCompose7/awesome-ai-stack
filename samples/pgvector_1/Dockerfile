# Minimal image for the pgvector sample app.
# Postgres (with the vector extension) runs as a separate service — see
# docker-compose.yml.
FROM python:3.13-slim

# Stream stdout/stderr unbuffered so the output appears live.
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

# DATABASE_URL points at your Postgres (the bundled one is set in compose):
#   docker compose up --build
ENTRYPOINT ["python", "app.py"]
