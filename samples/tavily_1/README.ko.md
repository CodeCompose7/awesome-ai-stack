# Tavily 웹 검색 에이전트 — 오늘의 환율 묻기

[Tavily](https://tavily.com) 기반 `web_search` 도구 하나를 가진 약 40줄짜리
[LangGraph](https://github.com/langchain-ai/langgraph) ReAct 에이전트입니다.
"오늘 USD/KRW 환율?"처럼 지금의 데이터라야 답할 수 있는 질문을 던지면, 웹을
검색해 최신 결과를 읽고 값과 출처를 함께 답합니다. 모델은 LiteLLM을 통해
라우팅되므로 같은 코드가 Claude·OpenAI·Gemini에서 모두 동작합니다 — `.env`의
`MODEL`만 바꾸면 됩니다.

## 설정

```bash
cd samples/tavily_1
cp .env.sample .env
# .env 편집: TAVILY_API_KEY, MODEL, 그리고 해당 제공자의 키를 설정
```

`TAVILY_API_KEY`는 검색 도구라 항상 필요합니다. 그다음 모델을 고릅니다.

| 제공자 | `MODEL` 예시 | `.env`의 키 |
| --- | --- | --- |
| Anthropic Claude | `claude-opus-4-8` | `ANTHROPIC_API_KEY` |
| OpenAI | `gpt-4o` | `OPENAI_API_KEY` |
| Google AI Studio | `gemini/gemini-2.5-flash` | `GEMINI_API_KEY` |

## Docker로 실행

```bash
docker build -t aas-tavily .
docker run --rm --env-file .env aas-tavily "오늘 USD/KRW 환율은?"
```

## 동작 방식

루프가 척추이고, 도구가 살아 있는 웹에 닿는 손입니다.

1. 모델이 질문과 `web_search` 도구의 스키마를 읽습니다.
2. 지금의 데이터가 필요하다고 판단해 검색어로 `web_search`를 호출합니다.
3. Tavily가 짧은 답과 출처 링크를 돌려줍니다.
4. 모델이 그 결과를 추론에 녹여 최종 답을 씁니다.

도구가 없으면 모델은 낡은 학습 지식으로 추측만 하지만, 도구가 있으면 답이
오늘의 웹에 근거합니다.

## 실행 결과

```text
$ docker run --rm --env-file .env aas-tavily "오늘 USD/KRW 환율은?"
오늘 USD/KRW 환율은 약 1,370원입니다. (출처: ...)
```
