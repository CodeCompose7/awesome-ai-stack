# Minimal image for the Ollama sample.
FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

# Provide your config at run time (.env is NOT baked into the image):
#   docker run --rm --env-file .env aas-ollama "<prompt>"
ENTRYPOINT ["python", "app.py"]
