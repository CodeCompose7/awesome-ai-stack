# Minimal image for the Chroma sample. No API key — Chroma runs in-process and
# downloads its built-in embedding model on first query.
FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

ENTRYPOINT ["python", "app.py"]
