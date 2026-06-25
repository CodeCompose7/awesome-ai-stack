# Minimal image for the LangGraph sample agent.
FROM python:3.13-slim

# Stream stdout/stderr unbuffered so the agent's output appears live (and isn't
# lost if the container is killed mid-run, e.g. under low memory).
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

# Provide your config at run time (.env is NOT baked into the image):
#   docker run --rm --env-file .env aas-langgraph "<question>"
ENTRYPOINT ["python", "app.py"]
