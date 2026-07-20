# smolagents — 구현 샘플

아주 작은 [smolagents](https://huggingface.co/docs/smolagents) 샘플입니다. 코드를
작성·실행해 과제를 푸는 **코드 에이전트**를 실행합니다. 모델은 LiteLLM으로
라우팅되므로 `MODEL`로 어떤 제공자든 쓸 수 있습니다.

## 설정

```bash
cd samples/smolagents_1
cp .env.sample .env
# .env 편집: ANTHROPIC_API_KEY 설정(또는 MODEL과 해당 키로 교체)
```

## Docker로 실행

```bash
cd samples/smolagents_1
docker build -t aas-smolagents .
docker run --rm --env-file .env aas-smolagents "Compute 2 ** 10 + 5 in Python and return the number."
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

Docker-outside-of-Docker에서는 포그라운드 `docker run`이 아무것도 출력하지 않을 수
있습니다 — detached로 실행하고 로그를 따라가세요:

```bash
docker logs -f "$(docker run -d --env-file .env aas-smolagents "Compute 2 ** 10 + 5 in Python and return the number.")"
```

## 로컬에서 실행

```bash
cd samples/smolagents_1
pip install -r requirements.txt
python app.py "Compute 2 ** 10 + 5 in Python and return the number."
```

---

## 실행 결과

> 에이전트가 추론 단계를 출력하고, 마지막 줄이 정답입니다. 표현은 달라져도 계산된
> 값은 일정합니다. `claude-opus-4-8`로 실행한 한 예입니다:

```text
result: 1029
```
