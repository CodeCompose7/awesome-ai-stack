# DeepEval — 구현 샘플

아주 작은 [DeepEval](https://deepeval.com/docs) 샘플입니다. Answer Relevancy
지표(LLM 채점)로 답을 채점합니다.

## 설정

```bash
cd samples/deepeval_1
cp .env.sample .env
# .env 편집: OPENAI_API_KEY 설정(채점 모델로 사용)
```

## Docker로 실행

```bash
cd samples/deepeval_1
docker build -t aas-deepeval .
docker run --rm --env-file .env aas-deepeval
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

Docker-outside-of-Docker에서는 포그라운드 `docker run`이 아무것도 출력하지 않을 수
있습니다 — detached로 실행하고 로그를 따라가세요:

```bash
docker logs -f "$(docker run -d --env-file .env aas-deepeval)"
```

## 로컬에서 실행

```bash
cd samples/deepeval_1
pip install -r requirements.txt
python app.py
```

---

## 실행 결과

> 점수는 LLM 채점을 쓰므로 점수와 사유가 실행마다 조금씩 달라집니다. `gpt-4o-mini`로
> 실행한 한 예입니다:

```text
answer_relevancy: 1.00
reason: The score is 1.00 because the response directly addresses the question about the programming language of Qdrant without any irrelevant statements.
```
