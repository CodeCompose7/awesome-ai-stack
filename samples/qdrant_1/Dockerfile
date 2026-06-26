# Minimal image for the Qdrant sample. No API key — it runs an in-memory Qdrant
# and downloads a small fastembed model on first use.
FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

ENTRYPOINT ["python", "app.py"]
