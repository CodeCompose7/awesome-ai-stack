# Firecrawl 웹 스크래핑 에이전트 — 문서를 마크다운으로

[Firecrawl](https://firecrawl.dev) 기반 `scrape` 도구 하나를 가진 약 45줄짜리
[LangGraph](https://github.com/langchain-ai/langgraph) ReAct 에이전트입니다.
"이 문서 페이지를 읽고 요약해줘"처럼 페이지 내용이 필요한 작업을 던지면, 그
페이지를 깔끔한 마크다운으로 가져와 읽고 답합니다. 모델은 LiteLLM을 통해
라우팅되므로 **같은 코드**가 **Anthropic Claude**, **OpenAI**,
**Google AI Studio (Gemini)** 에서 모두 동작합니다 — 코드는 그대로 두고 `.env`의
`MODEL`만 바꾸면 됩니다.

## 설정

```bash
cd samples/firecrawl_1
cp .env.sample .env
# .env 편집: FIRECRAWL_API_KEY, MODEL, 그리고 해당 제공자의 키를 설정
```

`FIRECRAWL_API_KEY`는 스크래핑 도구라 항상 필요합니다. 그다음 `MODEL`이 제공자를
결정합니다:

| 제공자            | `MODEL` 예시              | `.env`의 키          |
| ----------------- | ------------------------- | ------------------- |
| Anthropic Claude  | `claude-opus-4-8`         | `ANTHROPIC_API_KEY` |
| OpenAI            | `gpt-4o`                  | `OPENAI_API_KEY`    |
| Google AI Studio  | `gemini/gemini-2.5-flash` | `GEMINI_API_KEY`    |

`.env`는 gitignore 처리되어 있고, `.env.sample`만 커밋됩니다.

## Docker로 실행

```bash
cd samples/firecrawl_1
docker build -t aas-firecrawl .
docker run --rm --env-file .env aas-firecrawl \
  "https://docs.firecrawl.dev 를 읽고 핵심 기능 3가지만 요약해줘"
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는 위의
포그라운드 `docker run`이 종종 아무것도 출력하지 않고 exit 0으로 끝납니다. 하지만
실행 자체는 성공한 것입니다. 스크립트는 끝까지 실행되고 출력도 Docker가 모두
캡처하는데, 실시간 **attach** 스트림만 그 출력을 VM 경계에서 흘려버립니다. 같은
컨테이너에 `docker logs`를 실행하면 전체 출력이 그대로 보이고, 컨테이너는 exit 0으로
끝나며 OOM도 아닙니다. **detached**로 실행하고 로그를 따라가세요:

```bash
cd samples/firecrawl_1
docker build -t aas-firecrawl .
docker logs -f "$(docker run -d --env-file .env aas-firecrawl \
  "https://docs.firecrawl.dev 를 읽고 핵심 기능 3가지만 요약해줘")"
```

## 로컬에서 실행

```bash
cd samples/firecrawl_1
pip install -r requirements.txt
python app.py "https://docs.firecrawl.dev 를 읽고 핵심 기능 3가지만 요약해줘"
```

`python-dotenv`가 `.env`를 자동으로 불러옵니다. Firecrawl 키는
[Firecrawl](https://firecrawl.dev)에서, 모델 키는
[Anthropic](https://console.anthropic.com/),
[OpenAI](https://platform.openai.com/api-keys),
[Google AI Studio](https://aistudio.google.com/apikey)에서 발급받으세요.

## 동작 방식

검색이 "어디를 볼지" 찾는 일이라면, 스크래핑은 그 페이지를 읽어 오는 일입니다.
루프가 척추이고, 도구가 페이지를 읽는 손입니다.

1. 모델이 작업과 `scrape` 도구의 스키마를 읽습니다.
2. 읽어야 할 URL로 `scrape`를 호출합니다.
3. Firecrawl이 그 페이지를 깔끔한 마크다운으로 가져옵니다.
4. 모델이 그 마크다운을 읽고 답을 씁니다.

도구가 없으면 모델은 링크 너머를 볼 수 없지만, 도구가 있으면 페이지의 실제 내용이
추론에 곧장 들어갑니다.

## 실행 결과

> 모델과 실행마다 결과가 달라집니다 — LLM은 비결정적이라 표현(그리고 에이전트의
> 구체적 단계)이 매번 다릅니다. 아래는 `claude-opus-4-8`로 실행한 한 예입니다.

```text
Firecrawl의 핵심 기능 3가지: (1) Scrape — 임의의 URL을 깔끔한 마크다운으로 변환,
(2) Crawl — 사이트 전체를 돌며 모든 페이지를 수집, (3) Search — 페이지를 찾아 그
내용까지 한 번에 반환.
```
