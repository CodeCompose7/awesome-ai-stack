# LlamaIndex — 구현 샘플

아주 작은 [LlamaIndex](https://www.llamaindex.ai) 샘플입니다. 문서 둘을 색인해
그에 근거한 답을 돌려줍니다(OpenAI 임베딩 + LLM).

## 설정

```bash
cd samples/llamaindex_1
cp .env.sample .env
# .env 편집: OPENAI_API_KEY 설정(임베딩과 LLM에 사용)
```

## Docker로 실행

```bash
cd samples/llamaindex_1
docker build -t aas-llamaindex .
docker run --rm --env-file .env aas-llamaindex "What language is Qdrant written in?"
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

Docker-outside-of-Docker에서는 포그라운드 `docker run`이 아무것도 출력하지 않을 수
있습니다 — detached로 실행하고 로그를 따라가세요:

```bash
docker logs -f "$(docker run -d --env-file .env aas-llamaindex "What language is Qdrant written in?")"
```

## 로컬에서 실행

```bash
cd samples/llamaindex_1
pip install -r requirements.txt
python app.py "What language is Qdrant written in?"
```

---

## 실행 결과

> 모델과 실행마다 결과가 달라집니다 — LLM은 비결정적입니다. `gpt-4o-mini`로 실행한
> 한 예입니다:

```text
Qdrant is written in Rust.
```
