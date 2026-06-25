# Langfuse — LLM 호출 트레이싱 (self-host)

아주 작은 [Langfuse](https://langfuse.com) 데모입니다. Claude 호출을 Langfuse
**generation 스팬**으로 감싸 **self-host** Langfuse로 보낸 뒤, 트레이스를 API로
다시 읽어와 왕복을 검증합니다("에러 안 났다"가 아니라 실제로 들어갔는지 확인). 함께
들어 있는 docker-compose가 Langfuse 스택 전체를 띄우고 `LANGFUSE_INIT_*`로
프로젝트와 고정 API 키를 부트스트랩하므로, UI에서 따로 클릭할 게 없습니다.

> **무거운 스택.** Langfuse v3는 Postgres + ClickHouse + Redis + MinIO + web +
> worker가 필요합니다. 첫 부팅에서 여러 이미지를 받고 DB 마이그레이션을 돌리니 몇
> 분 정도 걸립니다.

## 설정

```bash
cd samples/langfuse_1
cp .env.sample .env
# .env 편집: ANTHROPIC_API_KEY 설정 (직접 넣는 유일한 비밀키)
```

Langfuse API 키는 compose가 부트스트랩하므로, 트레이싱할 호출의 모델 키만
넣으면 됩니다. `.env`는 gitignore 처리되어 있고, `.env.sample`만 커밋됩니다.

## Docker Compose로 실행 (Langfuse 포함)

```bash
cd samples/langfuse_1
docker compose up --build
```

앱은 Langfuse 마이그레이션이 끝나기를 기다렸다가 호출을 보내고, 다시 읽어온
트레이스를 출력합니다. UI는 <http://localhost:3000>에서 볼 수 있습니다(로그인
`demo@example.com` / `demodemodemo`). 끝나면 스택을 내리고 볼륨까지 지우세요:

```bash
docker compose down -v
```

## Docker Compose로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는
attach된 `docker compose up`이 앱을 실제로 실행했는데도 출력을 보여주지 않을 수
있습니다. 실시간 attach 스트림이 VM 경계에서 출력을 흘려버리기 때문이니, detached로
실행하고 로그로 확인하세요:

```bash
cd samples/langfuse_1
docker compose up --build -d
docker compose logs -f app
docker compose down -v
```

## 참고

- 앱은 번들된 Langfuse(`http://langfuse-web:3000`)에 부트스트랩된 키로 접속합니다.
  **Langfuse Cloud**를 쓰려면 `LANGFUSE_HOST`·`LANGFUSE_PUBLIC_KEY`·
  `LANGFUSE_SECRET_KEY`를 설정하고 compose 스택은 건너뛰면 됩니다.
- `docker-compose.yml`의 인프라 비밀값은 데모 기본값입니다 — 로컬 임시 스택용이지
  프로덕션용이 아닙니다.

---

## 실행 결과

> 모델과 실행마다 결과가 달라집니다 — LLM은 비결정적이라 모델의 표현은 매번
> 다릅니다(여기서 보여주는 건 트레이스 왕복 자체입니다). 아래는 `claude-opus-4-8`로
> 실행한 한 예입니다.

```text
waiting for Langfuse at http://langfuse-web:3000 ...
model says: Langfuse is an open-source observability and analytics platform for
LLM applications that helps developers trace, monitor, debug, and evaluate their
AI-powered features.

reading the trace back from Langfuse ...
  trace id: 3a0fc910ed901d00ac418161a63398a2
  name:     plan
  input:    Summarize what Langfuse does in one sentence.
  output:   Langfuse is an open-source observability and analytics platform ...
  UI:       http://langfuse-web:3000/project/demo-project/traces/3a0fc910ed901d00ac418161a63398a2
```
