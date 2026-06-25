# OpenHands — 자율 코딩 에이전트 (로컬 워크스페이스)

OpenHands Agent SDK로 만든 headless [OpenHands](https://www.all-hands.dev)
실행입니다. 에이전트에 터미널·파일 편집 도구와 작업을 주면, 끝날 때까지
읽기–편집–실행 루프를 돕니다. SDK의 **로컬 워크스페이스**를 쓰기 때문에 에이전트가
이 컨테이너 안에서 동작하고 — **중첩 Docker 샌드박스가 없습니다** — 전체가 `docker
run` 한 번으로 끝납니다.

> **무거운 이미지.** OpenHands는 의존성(playwright, jupyter 등)이 큽니다. 이미지가
> 수 GB이고 첫 빌드가 느립니다.

## 설정

```bash
cd samples/openhands_1
cp .env.sample .env
# .env 편집: LLM_MODEL과 LLM_API_KEY 설정
```

`LLM_MODEL`은 LiteLLM 형식 이름이라 어떤 제공자든 됩니다:

| 제공자            | `LLM_MODEL`                 | `LLM_API_KEY`         |
| ----------------- | --------------------------- | --------------------- |
| Anthropic Claude  | `anthropic/claude-opus-4-8` | Anthropic 키          |
| OpenAI            | `openai/gpt-4o`             | OpenAI 키             |

`.env`는 gitignore 처리되어 있고, `.env.sample`만 커밋됩니다.

## Docker로 실행

```bash
cd samples/openhands_1
docker build -t aas-openhands .
docker run --rm --env-file .env aas-openhands \
  "Create result.txt with the result of 2 + 2, then read it back."
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는 위의
포그라운드 `docker run`이 종종 아무것도 출력하지 않고 exit 0으로 끝납니다. 하지만
실행 자체는 성공한 것입니다. 에이전트는 끝까지 실행되고 출력도 Docker가 모두
캡처하는데, 실시간 **attach** 스트림만 그 출력을 VM 경계에서 흘려버립니다. 같은
컨테이너에 `docker logs`를 실행하면 전체 출력이 그대로 보이고, 컨테이너는 exit 0으로
끝나며 OOM도 아닙니다. **detached**로 실행하고 로그를 따라가세요:

```bash
cd samples/openhands_1
docker build -t aas-openhands .
docker logs -f "$(docker run -d --env-file .env aas-openhands \
  "Create result.txt with the result of 2 + 2, then read it back.")"
```

(이 샘플은 SDK의 로컬 워크스페이스를 쓰므로 OpenHands 기본 Docker 런타임과 달리 두
번째 컨테이너를 띄우지 **않습니다**.)

## 로컬에서 실행

```bash
cd samples/openhands_1
pip install -r requirements.txt
python app.py "Create result.txt with the result of 2 + 2, then read it back."
```

## 참고

- `app.py`의 **`reasoning_effort=None`**: `claude-opus-4-8`은 이 OpenHands/LiteLLM
  빌드가 보내는 것보다 새로운 thinking API를 쓰기 때문에, 호환을 위해 확장
  사고(extended thinking)를 끕니다. 다른 모델(예: `openai/gpt-4o`)은 그대로 됩니다.

---

## 실행 결과

> 모델과 실행마다 결과가 달라집니다 — LLM은 비결정적이라 표현(그리고 에이전트의
> 구체적 단계)이 매번 다릅니다. 아래는 `anthropic/claude-opus-4-8`로 실행한 한
> 예입니다.

```text
Message from User ──────────────────────────────────────────────
Create result.txt with the result of 2 + 2, then read it back.

Agent Action ───────────────────────────────────────────────────
$ echo $((2 + 2)) > /workspace/result.txt && cat /workspace/result.txt

Observation ─────────────────────────────────────────────────────
Tool: terminal
Result:
4
✅ Exit code: 0

Message from Agent ──────────────────────────────────────────────
I created `/workspace/result.txt` containing the result of 2 + 2, then read it
back. The value is **4**.
```
