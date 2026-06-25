# LangGraph — 최소 도구 사용 에이전트

약 50줄짜리 [LangGraph](https://www.langchain.com/langgraph) ReAct 에이전트입니다.
두 개의 도구(`multiply`, `is_prime`)로 LLM을 호출하고, 답을 낼 수 있을 때까지 추론
루프를 돕니다. 모델은 [LiteLLM](https://docs.litellm.ai/)을 통해 라우팅되므로 같은
코드가 **Anthropic Claude**, **OpenAI**, **Google AI Studio (Gemini)** 에서 모두
동작합니다 — `.env`의 `MODEL`만 바꾸면 됩니다.

## 설정

```bash
cd samples/langgraph_1
cp .env.sample .env
# .env 편집: MODEL과 해당 제공자의 키를 설정
```

`MODEL`이 제공자를 결정합니다:

| 제공자            | `MODEL` 예시              | `.env`의 키          |
| ----------------- | ------------------------- | ------------------- |
| Anthropic Claude  | `claude-opus-4-8`         | `ANTHROPIC_API_KEY` |
| OpenAI            | `gpt-4o`                  | `OPENAI_API_KEY`    |
| Google AI Studio  | `gemini/gemini-2.5-flash` | `GEMINI_API_KEY`    |
| Ollama (local)    | `ollama_chat/qwen3.5:9b`  | `OLLAMA_API_BASE`   |

`.env`는 gitignore 처리되어 있고, `.env.sample`만 커밋됩니다.

**Ollama (로컬 모델):** 먼저 호스트에서 모델을 받아두세요 —
`ollama pull qwen3.5:9b`(또는 `ollama run qwen3.5:9b`)를 실행합니다. 그다음
`MODEL=ollama_chat/qwen3.5:9b`로 설정하고 `OLLAMA_API_BASE`를 서버 주소로 지정하세요 — API
키는 필요 없습니다. DooD를 쓰는 devcontainer에서는 컨테이너가 호스트의 Ollama에
`http://host.docker.internal:11434`로 접근하고, 로컬 실행 시에는
`http://localhost:11434`를 씁니다. 도구 호출은 Ollama의 chat 엔드포인트가 필요하므로 위의 `ollama_chat/` prefix를 쓰세요 — `ollama/`가 아닙니다. `ollama/`로는 빈 출력에 도구 호출이 나오지 않습니다. 로컬 모델도 도구를 지원해야 합니다 — 예를 들어 `gemma`는 지원하지 않습니다.

## Docker로 실행

```bash
cd samples/langgraph_1
docker build -t aas-langgraph .
docker run --rm --env-file .env aas-langgraph \
  "What is 24 * 7, and is the result prime?"
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는 위의
포그라운드 `docker run`이 종종 아무것도 출력하지 않고 exit 0으로 끝납니다. 하지만
실행 자체는 성공한 것입니다. 에이전트는 끝까지 실행되고 출력도 Docker가 모두
캡처하는데, 실시간 **attach** 스트림만 그 출력을 VM 경계에서 흘려버립니다. 같은
컨테이너에 `docker logs`를 실행하면 전체 출력이 그대로 보이고, 컨테이너는 exit 0으로
끝나며 OOM도 아닙니다. **detached**로 실행하고 로그를 따라가세요:

```bash
cd samples/langgraph_1
docker build -t aas-langgraph .
docker logs -f "$(docker run -d --env-file .env aas-langgraph \
  "What is 24 * 7, and is the result prime?")"
```

## 로컬에서 실행

```bash
cd samples/langgraph_1
pip install -r requirements.txt
python app.py "What is 24 * 7, and is the result prime?"
```

`python-dotenv`가 `.env`를 자동으로 불러옵니다. 키는 다음에서 발급받으세요:
[Anthropic](https://console.anthropic.com/),
[OpenAI](https://platform.openai.com/api-keys),
[Google AI Studio](https://aistudio.google.com/apikey).

---

## 실행 결과

> 모델과 실행마다 결과가 달라집니다 — LLM은 비결정적이라 표현(그리고 에이전트의
> 구체적 단계)이 매번 다릅니다. 아래는 `claude-opus-4-8`로 실행한 한 예입니다.

```text
24 * 7 = **168**, and it is **not prime**. (168 is even and has many factors, such as 2, 3, 4, 6, 7, 8, etc.)
```
