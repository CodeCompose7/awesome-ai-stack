# Image for the Sentence Transformers sample. Pulls PyTorch, so it is several GB
# and the first build is slow. No API key — the model runs on CPU.
FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

ENTRYPOINT ["python", "app.py"]
