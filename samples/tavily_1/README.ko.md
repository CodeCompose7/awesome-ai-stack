# Tavily 웹 검색 에이전트 — 오늘의 환율 묻기

[Tavily](https://tavily.com) 기반 `web_search` 도구 하나를 가진 약 40줄짜리
[LangGraph](https://github.com/langchain-ai/langgraph) ReAct 에이전트입니다.
"오늘 USD/KRW 환율?"처럼 지금의 데이터라야 답할 수 있는 질문을 던지면, 웹을
검색해 최신 결과를 읽고 값과 출처를 함께 답합니다. 모델은 LiteLLM을 통해
라우팅되므로 **같은 코드**가 **Anthropic Claude**, **OpenAI**,
**Google AI Studio (Gemini)** 에서 모두 동작합니다 — 코드는 그대로 두고 `.env`의
`MODEL`만 바꾸면 됩니다.

## 설정

```bash
cd samples/tavily_1
cp .env.sample .env
# .env 편집: TAVILY_API_KEY, MODEL, 그리고 해당 제공자의 키를 설정
```

`TAVILY_API_KEY`는 검색 도구라 항상 필요합니다. 그다음 `MODEL`이 제공자를
결정합니다:

| 제공자            | `MODEL` 예시              | `.env`의 키          |
| ----------------- | ------------------------- | ------------------- |
| Anthropic Claude  | `claude-opus-4-8`         | `ANTHROPIC_API_KEY` |
| OpenAI            | `gpt-4o`                  | `OPENAI_API_KEY`    |
| Google AI Studio  | `gemini/gemini-2.5-flash` | `GEMINI_API_KEY`    |

`.env`는 gitignore 처리되어 있고, `.env.sample`만 커밋됩니다.

## Docker로 실행

```bash
cd samples/tavily_1
docker build -t aas-tavily .
docker run --rm --env-file .env aas-tavily "오늘 USD/KRW 환율은?"
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는 위의
포그라운드 `docker run`이 종종 아무것도 출력하지 않고 exit 0으로 끝납니다. 하지만
실행 자체는 성공한 것입니다. 스크립트는 끝까지 실행되고 출력도 Docker가 모두
캡처하는데, 실시간 **attach** 스트림만 그 출력을 VM 경계에서 흘려버립니다. 같은
컨테이너에 `docker logs`를 실행하면 전체 출력이 그대로 보이고, 컨테이너는 exit 0으로
끝나며 OOM도 아닙니다. **detached**로 실행하고 로그를 따라가세요:

```bash
cd samples/tavily_1
docker build -t aas-tavily .
docker logs -f "$(docker run -d --env-file .env aas-tavily \
  "오늘 USD/KRW 환율은?")"
```

## 로컬에서 실행

```bash
cd samples/tavily_1
pip install -r requirements.txt
python app.py "오늘 USD/KRW 환율은?"
```

`python-dotenv`가 `.env`를 자동으로 불러옵니다. Tavily 키는
[Tavily](https://tavily.com)에서, 모델 키는
[Anthropic](https://console.anthropic.com/),
[OpenAI](https://platform.openai.com/api-keys),
[Google AI Studio](https://aistudio.google.com/apikey)에서 발급받으세요.

## 동작 방식

루프가 척추이고, 도구가 살아 있는 웹에 닿는 손입니다.

1. 모델이 질문과 `web_search` 도구의 스키마를 읽습니다.
2. 지금의 데이터가 필요하다고 판단해 검색어로 `web_search`를 호출합니다.
3. Tavily가 짧은 답과 출처 링크를 돌려줍니다.
4. 모델이 그 결과를 추론에 녹여 최종 답을 씁니다.

도구가 없으면 모델은 낡은 학습 지식으로 추측만 하지만, 도구가 있으면 답이
오늘의 웹에 근거합니다.

---

## 실행 결과

> 모델과 실행마다 결과가 달라집니다 — LLM은 비결정적이라 표현(그리고 에이전트의
> 구체적 단계)이 매번 다릅니다. 아래는 `gemini/gemini-2.5-flash`로 실행한 한 예입니다.

```text
오늘 USD/KRW 환율은 약 1,543.45원입니다. 이 환율은 시장 상황에 따라 변동될 수 있으므로, 가장 최신 정보는 금융 뉴스 또는 환율 웹사이트에서 확인하시는 것이 좋습니다.
```
