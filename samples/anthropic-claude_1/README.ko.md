# Anthropic Claude — 도구를 사용하는 에이전트 한 턴

공식 [Anthropic SDK](https://docs.anthropic.com/)로 만든 아주 작은 에이전트
루프입니다. Claude에 도구 하나(`get_weather`)를 주면 Claude가 그것을 호출하고,
스크립트는 결과를 `tool_result`로 다시 보냅니다 — Claude가 최종 답을 쓸 때까지
반복합니다. 이 루프가 에이전트의 핵심 패턴입니다.

## 설정

```bash
cd samples/anthropic-claude_1
cp .env.sample .env
# .env 편집: ANTHROPIC_API_KEY 설정 (필요하면 MODEL도)
```

키는 [console.anthropic.com](https://console.anthropic.com/)에서 발급받으세요.
`MODEL`의 기본값은 `claude-opus-4-8`이며,
[모델 목록](https://docs.anthropic.com/en/docs/about-claude/models)을 참고하세요.

`.env`는 gitignore 처리되어 있고, `.env.sample`만 커밋됩니다.

## Docker로 실행

```bash
cd samples/anthropic-claude_1
docker build -t aas-anthropic-claude .
docker run --rm --env-file .env aas-anthropic-claude "What should I wear in Seoul today?"
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는 위의
포그라운드 `docker run`이 종종 아무것도 출력하지 않고 exit 0으로 끝납니다. 하지만
실행 자체는 성공한 것입니다. 스크립트는 끝까지 실행되고 출력도 Docker가 모두
캡처하는데, 실시간 **attach** 스트림만 그 출력을 VM 경계에서 흘려버립니다. 같은
컨테이너에 `docker logs`를 실행하면 전체 출력이 그대로 보이고, 컨테이너는 exit 0으로
끝나며 OOM도 아닙니다. **detached**로 실행하고 로그를 따라가세요:

```bash
cd samples/anthropic-claude_1
docker build -t aas-anthropic-claude .
docker logs -f "$(docker run -d --env-file .env aas-anthropic-claude \
  "What should I wear in Seoul today?")"
```

## 로컬에서 실행

```bash
cd samples/anthropic-claude_1
pip install -r requirements.txt
python app.py "What should I wear in Seoul today?"
```

`python-dotenv`가 `.env`를 자동으로 불러옵니다.
