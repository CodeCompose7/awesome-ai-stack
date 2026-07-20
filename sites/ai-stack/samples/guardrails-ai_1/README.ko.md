# Guardrails AI — 구현 샘플

아주 작은 [Guardrails AI](https://www.guardrailsai.com/docs) 샘플입니다. LLM에
JSON을 요청한 뒤, 그 출력을 Pydantic 스키마로 검증합니다 — 타입을 변환하고
`age >= 0` 제약을 확인한 다음에야 신뢰합니다.

## 설정

```bash
cd samples/guardrails-ai_1
cp .env.sample .env
# .env 편집: OPENAI_API_KEY 설정(LLM 호출에 사용)
```

## Docker로 실행

```bash
cd samples/guardrails-ai_1
docker build -t aas-guardrails .
docker run --rm --env-file .env aas-guardrails
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

Docker-outside-of-Docker에서는 포그라운드 `docker run`이 아무것도 출력하지 않을 수
있습니다 — detached로 실행하고 로그를 따라가세요:

```bash
docker logs -f "$(docker run -d --env-file .env aas-guardrails)"
```

## 로컬에서 실행

```bash
cd samples/guardrails-ai_1
pip install -r requirements.txt
python app.py
```

---

## 실행 결과

> 모델이 `Rex`·`dog`·`3`이 담긴 JSON을 반환하고, Guard가 이를 스키마에 맞춰 파싱·
> 검증합니다. `gpt-4o-mini`로 실행한 한 예입니다:

```text
validation passed: True
validated output: {'name': 'Rex', 'species': 'dog', 'age': 3}
```
