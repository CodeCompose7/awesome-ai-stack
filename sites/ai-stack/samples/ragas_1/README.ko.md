# Ragas — 구현 샘플

아주 작은 [Ragas](https://docs.ragas.io) 샘플입니다. RAG 답을 충실도와 응답
관련성으로 채점하며, OpenAI 모델과 임베딩이 채점을 맡습니다.

## 설정

```bash
cd samples/ragas_1
cp .env.sample .env
# .env 편집: OPENAI_API_KEY 설정(채점 LLM과 임베딩)
```

## Docker로 실행

```bash
cd samples/ragas_1
docker build -t aas-ragas .
docker run --rm --env-file .env aas-ragas
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

Docker-outside-of-Docker에서는 포그라운드 `docker run`이 아무것도 출력하지 않을 수
있습니다 — detached로 실행하고 로그를 따라가세요:

```bash
docker logs -f "$(docker run -d --env-file .env aas-ragas)"
```

## 로컬에서 실행

```bash
cd samples/ragas_1
pip install -r requirements.txt
python app.py
```

---

## 실행 결과

> 점수는 LLM 채점을 쓰므로 실행마다 조금씩 달라집니다. `gpt-4o-mini`로 실행한 한
> 예입니다:

```text
{'faithfulness': 1.0000, 'answer_relevancy': 0.9701}
```
