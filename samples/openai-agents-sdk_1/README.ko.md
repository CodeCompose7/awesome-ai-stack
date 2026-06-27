# OpenAI Agents SDK — 구현 샘플

아주 작은 [OpenAI Agents SDK](https://openai.github.io/openai-agents-python)
샘플입니다. 에이전트를 정의해 프롬프트를 실행합니다.

## 설정

```bash
cd samples/openai-agents-sdk_1
cp .env.sample .env
# .env 편집: OPENAI_API_KEY 설정(필요하면 MODEL도)
```

## Docker로 실행

```bash
cd samples/openai-agents-sdk_1
docker build -t aas-openai-agents .
docker run --rm --env-file .env aas-openai-agents "Summarize AI agents in one sentence."
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

Docker-outside-of-Docker에서는 포그라운드 `docker run`이 아무것도 출력하지 않을 수
있습니다 — detached로 실행하고 로그를 따라가세요:

```bash
docker logs -f "$(docker run -d --env-file .env aas-openai-agents "Summarize AI agents in one sentence.")"
```

## 로컬에서 실행

```bash
cd samples/openai-agents-sdk_1
pip install -r requirements.txt
python app.py "Summarize AI agents in one sentence."
```

---

## 실행 결과

> 모델과 실행마다 결과가 달라집니다 — LLM은 비결정적입니다. `gpt-4o-mini`로 실행한
> 한 예입니다:

```text
An AI agent is an autonomous system that perceives its environment, makes decisions based on that information, and acts to achieve specific goals.
```
