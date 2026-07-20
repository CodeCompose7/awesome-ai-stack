# Minimal image for the Milvus Lite sample. Embedded — no services, no keys.
# Python 3.12 for the widest milvus-lite wheel availability.
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

ENTRYPOINT ["python", "app.py"]
