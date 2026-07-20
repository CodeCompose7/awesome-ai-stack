# Ollama — LiteLLM으로 로컬 LLM 호출

로컬 [Ollama](https://ollama.com) 서버에서 도는 모델을 LiteLLM으로 호출하는 아주 작은
스크립트입니다 — API 키도, 클라우드도 필요 없습니다. LiteLLM을 거치므로 `MODEL`만
바꾸면 같은 코드가 클라우드 모델에서도 돕니다.

## 설정

```bash
cd samples/ollama_1
cp .env.sample .env
```

먼저 호스트에서 모델을 받아두세요 — `ollama pull qwen3.5:9b`(또는 `ollama run
qwen3.5:9b`). API 키는 필요 없습니다. `.env`는 `MODEL`과 `OLLAMA_API_BASE`를
설정하며, DooD를 쓰는 devcontainer에서는 컨테이너가 호스트의 Ollama에
`http://host.docker.internal:11434`로 접근합니다 — `.env.sample`의 기본값입니다.

> 도구 호출에는 `ollama/`가 아니라 `ollama_chat/` prefix(Ollama의 chat
> 엔드포인트)와 도구 지원 모델이 필요합니다.

## Docker로 실행

```bash
cd samples/ollama_1
docker build -t aas-ollama .
docker run --rm --env-file .env aas-ollama "Summarize Ollama in one line."
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는 위의
포그라운드 `docker run`이 종종 아무것도 출력하지 않고 exit 0으로 끝납니다. 하지만
실행 자체는 성공한 것입니다. 스크립트는 끝까지 실행되고 출력도 Docker가 모두
캡처하는데, 실시간 **attach** 스트림만 그 출력을 VM 경계에서 흘려버립니다.
**detached**로 실행하고 로그를 따라가세요:

```bash
cd samples/ollama_1
docker build -t aas-ollama .
docker logs -f "$(docker run -d --env-file .env aas-ollama \
  "Summarize Ollama in one line.")"
```

## 로컬에서 실행

```bash
cd samples/ollama_1
pip install -r requirements.txt
# 로컬 Ollama로 지정(도커 없이): http://localhost:11434
OLLAMA_API_BASE=http://localhost:11434 python app.py "Summarize Ollama in one line."
```

---

## 실행 결과

> 모델과 실행마다 결과가 달라집니다 — LLM은 비결정적이라 표현이 매번 다릅니다.
> 아래는 `ollama_chat/qwen3.5:9b`로 실행한 한 예입니다.

```text
Ollama allows users to easily run open-source large language models locally on
their own devices, enabling private and offline access to AI without relying on
external servers or internet connectivity.
```
