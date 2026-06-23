# Minimal image for the from-scratch LangGraph sample agent.
FROM python:3.12-slim

# Stream stdout/stderr unbuffered so the agent's output appears live.
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

# Provide your config at run time (.env is NOT baked into the image):
#   docker run --rm --env-file .env aas-langgraph2 "<question>"
ENTRYPOINT ["python", "app.py"]
