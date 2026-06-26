# Arize Phoenix — LLM 호출 트레이싱 (self-host)

아주 작은 [Phoenix](https://arize.com/phoenix/) 데모입니다. 함께 들어 있는
docker-compose가 Phoenix 서버를 띄우고, 앱은 OpenTelemetry 트레이싱을 등록한 뒤
**LiteLLM** 호출을 한 번(자동 계측) 하고, Phoenix에서 span을 다시 조회해 왕복을
검증합니다 — "에러 안 났다"가 아니라 실제로 들어갔는지 확인합니다.

## 설정

```bash
cd samples/arize-phoenix_1
cp .env.sample .env
# .env 편집: ANTHROPIC_API_KEY 설정 (트레이싱할 호출용)
```

Phoenix 자체는 키가 필요 없고, 모델 키만 넣으면 됩니다. `.env`는 gitignore 처리되어
있고, `.env.sample`만 커밋됩니다.

## Docker Compose로 실행

```bash
cd samples/arize-phoenix_1
docker compose up --build
```

앱이 Phoenix를 기다렸다가 트레이싱할 호출을 보내고, 다시 읽어온 span을 출력합니다.
UI는 <http://localhost:6006>에서 볼 수 있습니다. 끝나면 정리하세요:

```bash
docker compose down -v
```

## Docker Compose로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는 attach된
`docker compose up`이 앱을 실제로 실행했는데도 출력을 안 보여줄 수 있습니다. 실시간
attach 스트림이 VM 경계에서 출력을 흘려버리기 때문이니, detached로 실행하고 로그로
확인하세요:

```bash
cd samples/arize-phoenix_1
docker compose up --build -d
docker compose logs -f app
docker compose down -v
```

## 참고

- 트레이싱할 호출은 LiteLLM을 거치므로 `docker-compose.yml`의 `MODEL`을 어떤
  제공자로든 바꾸고 해당 키만 넣으면 됩니다.
- **Phoenix Cloud**로 보내려면 `PHOENIX_COLLECTOR_ENDPOINT`를 거기로 지정하고 번들
  서버는 건너뛰세요.

---

## 실행 결과

> 모델 표현은 실행마다 다릅니다 — LLM은 비결정적입니다. 여기서 보여주는 건 트레이스
> 왕복입니다. 아래는 `anthropic/claude-opus-4-8`로 실행한 한 예입니다.

```text
model says: Arize Phoenix is an open-source observability and evaluation platform
for tracing, monitoring, and debugging LLM and AI applications.

reading spans back from Phoenix ...
  traced 1 span(s): ['completion']
  UI: http://localhost:6006
```
