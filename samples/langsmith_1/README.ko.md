# LangSmith — Claude 호출 트레이싱 (hosted)

아주 작은 [LangSmith](https://www.langchain.com/langsmith) 데모입니다.
`@traceable`로 Claude 호출을 감싸 LangSmith에 run으로 보낸 뒤, SDK로 그 run을 다시
읽어와 출력합니다 — "에러 안 났다"가 아니라 실제로 들어갔는지 확인하는 왕복
검증입니다. LangSmith는 **호스티드 SaaS**라 본인 API 키가 필요합니다. 무료
self-host는 없습니다.

## 설정

```bash
cd samples/langsmith_1
cp .env.sample .env
# .env 편집: LANGSMITH_API_KEY와 ANTHROPIC_API_KEY 설정
```

`.env`에 설정하세요:

- `LANGSMITH_API_KEY` — [smith.langchain.com](https://smith.langchain.com) → Settings → API Keys에서 발급
- `LANGSMITH_TRACING` — 트레이스를 보내려면 `true`
- `LANGSMITH_PROJECT` — run이 쌓일 프로젝트 이름
- `ANTHROPIC_API_KEY` — 트레이싱할 Claude 호출용 키

EU 계정은 `LANGSMITH_ENDPOINT=https://eu.api.smith.langchain.com`도 설정하세요.
`.env`는 gitignore 처리되어 있고, `.env.sample`만 커밋됩니다.

## Docker로 실행

```bash
cd samples/langsmith_1
docker build -t aas-langsmith .
docker run --rm --env-file .env aas-langsmith "How do I reset my password?"
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는 위의
포그라운드 `docker run`이 종종 아무것도 출력하지 않고 exit 0으로 끝납니다. 하지만
실행 자체는 성공한 것입니다. 스크립트는 끝까지 실행되고 출력도 Docker가 모두
캡처하는데, 실시간 **attach** 스트림만 그 출력을 VM 경계에서 흘려버립니다. 같은
컨테이너에 `docker logs`를 실행하면 전체 출력이 그대로 보이고, 컨테이너는 exit 0으로
끝나며 OOM도 아닙니다. **detached**로 실행하고 로그를 따라가세요:

```bash
cd samples/langsmith_1
docker build -t aas-langsmith .
docker logs -f "$(docker run -d --env-file .env aas-langsmith \
  "How do I reset my password?")"
```

## 로컬에서 실행

```bash
cd samples/langsmith_1
pip install -r requirements.txt
python app.py "How do I reset my password?"
```

`python-dotenv`가 `.env`를 자동으로 불러옵니다.

---

## 실행 결과

> 모델과 실행마다 결과가 달라집니다 — LLM은 비결정적이라 모델의 표현은 매번
> 다릅니다 — 여기서 보여주는 건 트레이스 왕복 자체입니다. 아래는 `claude-opus-4-8`로
> 실행한 한 예입니다.

```text
model says: I'd be happy to help you reset your password! However, the exact
steps depend on which service or account you're trying to access. ...

reading the run back from LangSmith ...
  run id:  019eff2d-6596-7461-80d0-25388eb56ec4
  name:    plan
  inputs:  {'question': 'How do I reset my password?'}
  outputs: {'output': "I'd be happy to help you reset your password! ..."}
  url:     https://smith.langchain.com/o/<org-id>/projects/p/<project-id>/r/019eff2d-...
```
