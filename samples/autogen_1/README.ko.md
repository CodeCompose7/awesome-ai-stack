# AutoGen — 구현 샘플

아주 작은 [AutoGen](https://microsoft.github.io/autogen/stable/) (AgentChat)
샘플입니다. 단일 어시스턴트 에이전트가 과제 하나를 실행합니다.

> 참고: AutoGen은 유지보수 전용이며, Microsoft는 신규 작업에 Microsoft Agent
> Framework를 권장합니다.

## 설정

```bash
cd samples/autogen_1
cp .env.sample .env
# .env 편집: OPENAI_API_KEY 설정(필요하면 MODEL도)
```

## Docker로 실행

```bash
cd samples/autogen_1
docker build -t aas-autogen .
docker run --rm --env-file .env aas-autogen "Say hello in one short sentence."
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

Docker-outside-of-Docker에서는 포그라운드 `docker run`이 아무것도 출력하지 않을 수
있습니다 — detached로 실행하고 로그를 따라가세요:

```bash
docker logs -f "$(docker run -d --env-file .env aas-autogen "Say hello in one short sentence.")"
```

## 로컬에서 실행

```bash
cd samples/autogen_1
pip install -r requirements.txt
python app.py "Say hello in one short sentence."
```

---

## 실행 결과

> 모델과 실행마다 결과가 달라집니다 — LLM은 비결정적입니다. `gpt-4o-mini`로 실행한
> 한 예입니다:

```text
Hello!
```
