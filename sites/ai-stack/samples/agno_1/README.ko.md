# Agno — Claude 기반 단일 에이전트

아주 작은 [Agno](https://www.agno.com) 샘플입니다. Claude 모델로 에이전트 하나를
만들고 프롬프트를 실행합니다.

## 설정

```bash
cd samples/agno_1
cp .env.sample .env
# .env 편집: ANTHROPIC_API_KEY 설정(필요하면 MODEL도)
```

## Docker로 실행

```bash
cd samples/agno_1
docker build -t aas-agno .
docker run --rm --env-file .env aas-agno "Say hello in one short sentence."
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

Docker-outside-of-Docker에서는 포그라운드 `docker run`이 아무것도 출력하지 않을 수
있습니다 — detached로 실행하고 로그를 따라가세요:

```bash
docker logs -f "$(docker run -d --env-file .env aas-agno "Say hello in one short sentence.")"
```

## 로컬에서 실행

```bash
cd samples/agno_1
pip install -r requirements.txt
python app.py "Say hello in one short sentence."
```

---

## 실행 결과

> 모델과 실행마다 결과가 달라집니다 — LLM은 비결정적입니다. `claude-opus-4-8`로
> 실행한 한 예입니다:

```text
Hello, it's nice to meet you!
```
