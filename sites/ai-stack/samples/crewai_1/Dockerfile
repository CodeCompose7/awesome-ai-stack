# Image for the CrewAI sample. CrewAI pulls a large dependency set (litellm,
# chromadb, ...), so the first build is slow.
FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1
# CrewAI sends anonymous telemetry by default; opt out for a clean, offline run.
ENV CREWAI_DISABLE_TELEMETRY=true
ENV OTEL_SDK_DISABLED=true

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

# Provide your config at run time (.env is NOT baked into the image):
#   docker run --rm --env-file .env aas-crewai "<topic>"
ENTRYPOINT ["python", "app.py"]
