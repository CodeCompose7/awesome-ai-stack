# Minimal image for the LangGraph sample agent.
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

# Provide your key at run time:
#   docker run --rm -e ANTHROPIC_API_KEY=sk-ant-... aas-langgraph "<question>"
ENTRYPOINT ["python", "app.py"]
