# NeMo Guardrails — 구현 샘플

아주 작은 [NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails) 샘플입니다.
Colang으로 쓴 인사 레일을 불러와 응답을 생성하므로, 봇은 자유 형식 대신 정해진
승인 메시지로 답합니다. 메인·임베딩 모델 모두 OpenAI라 로컬 모델 다운로드가 없습니다.

## 설정

```bash
cd samples/nemo-guardrails_1
cp .env.sample .env
# .env 편집: OPENAI_API_KEY 설정(메인·임베딩 모델에 사용)
```

## Docker로 실행

```bash
cd samples/nemo-guardrails_1
docker build -t aas-nemo .
docker run --rm --env-file .env aas-nemo
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

Docker-outside-of-Docker에서는 포그라운드 `docker run`이 아무것도 출력하지 않을 수
있습니다 — detached로 실행하고 로그를 따라가세요:

```bash
docker logs -f "$(docker run -d --env-file .env aas-nemo)"
```

## 로컬에서 실행

```bash
cd samples/nemo-guardrails_1
pip install -r requirements.txt
python app.py
```

---

## 실행 결과

> 인사 레일이 사용자의 "hi there"를 정해진 봇 메시지로 매핑하므로, 응답은 매번
> 동일합니다:

```text
bot: Hello! I'm a guardrailed assistant — I only respond through approved rails.
```
