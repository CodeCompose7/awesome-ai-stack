# LangGraph — minimal tool-using agent

A ~40-line [LangGraph](https://www.langchain.com/langgraph) ReAct agent: it calls
Claude with two tools (`multiply`, `is_prime`) and runs the reasoning loop until
it can answer.

## Run with Docker

```bash
cd samples/langgraph
docker build -t aas-langgraph .
docker run --rm -e ANTHROPIC_API_KEY=sk-ant-... aas-langgraph \
  "What is 24 * 7, and is the result prime?"
```

## Run locally

```bash
cd samples/langgraph
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
python app.py "What is 24 * 7, and is the result prime?"
```

You need an [Anthropic API key](https://console.anthropic.com/). The agent uses
`claude-opus-4-8`; change the model id in `app.py` to use a different one.
