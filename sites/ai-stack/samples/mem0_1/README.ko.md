# Mem0 — 기억 저장·회상

아주 작은 [Mem0](https://mem0.ai) 스크립트입니다. 사용자에 대한 사실을 추가한 뒤
검색합니다. Mem0는 메시지를 간결한 사실로 추려(LLM) 저장하고, 관련된 것을 벡터
스토어에서 회상합니다. 이 설정은 OpenAI를 씁니다.

## 설정

```bash
cd samples/mem0_1
cp .env.sample .env
# .env 편집: OPENAI_API_KEY 설정
```

여기 Mem0 설정은 사실 추출과 임베딩에 OpenAI를 씁니다. 키는
[platform.openai.com/api-keys](https://platform.openai.com/api-keys)에서
발급받으세요. `.env`는 gitignore 처리되어 있고, `.env.sample`만 커밋됩니다.

## Docker로 실행

```bash
cd samples/mem0_1
docker build -t aas-mem0 .
docker run --rm --env-file .env aas-mem0 "what are alice's travel preferences?"
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는 위의
포그라운드 `docker run`이 종종 아무것도 출력하지 않고 exit 0으로 끝납니다. 하지만
실행 자체는 성공한 것입니다. 스크립트는 끝까지 실행되고 출력도 Docker가 모두
캡처하는데, 실시간 **attach** 스트림만 그 출력을 VM 경계에서 흘려버립니다.
**detached**로 실행하고 로그를 따라가세요:

```bash
cd samples/mem0_1
docker build -t aas-mem0 .
docker logs -f "$(docker run -d --env-file .env aas-mem0 \
  "what are alice's travel preferences?")"
```

## 로컬에서 실행

```bash
cd samples/mem0_1
pip install -r requirements.txt
python app.py "what are alice's travel preferences?"
```

`python-dotenv`가 `.env`를 자동으로 불러옵니다.

---

## 실행 결과

> 모델과 실행마다 결과가 달라집니다 — LLM은 비결정적이라 회상되는 표현이 매번
> 다릅니다. 아래는 OpenAI로 추출·회상한 한 번의 실행 예입니다.

```text
query: what are alice's travel preferences?
  - User prefers window seats when traveling and enjoys vegetarian meals.
```
