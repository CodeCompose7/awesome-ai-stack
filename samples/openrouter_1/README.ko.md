# OpenRouter — 키 하나로 여러 모델 (LiteLLM 경유)

아주 작은 [OpenRouter](https://openrouter.ai/) 스크립트입니다. 프롬프트 하나를
`litellm.completion()`으로 보내고 응답을 출력합니다.
[OpenRouter](https://openrouter.ai/)는 수백 개의 모델을 단일 API 키 뒤에 두는
OpenAI 호환 게이트웨이입니다. 코드는 그대로 두고 `MODEL`만 바꾸면 **Claude**,
**GPT**, **Gemini**, **Llama** 등을 오갈 수 있습니다.

## 설정

```bash
cd samples/openrouter_1
cp .env.sample .env
# .env 편집: OPENROUTER_API_KEY를 붙여넣고 필요하면 MODEL도 변경
```

`MODEL`은 `openrouter/<vendor>/<model>` 형식의 LiteLLM 식별자입니다:

| 벤더 / 모델      | `MODEL`                                          |
| ---------------- | ------------------------------------------------ |
| Anthropic Claude | `openrouter/anthropic/claude-opus-4-8`           |
| OpenAI           | `openrouter/openai/gpt-4o`                       |
| Google Gemini    | `openrouter/google/gemini-2.5-flash`             |
| Meta Llama       | `openrouter/meta-llama/llama-3.3-70b-instruct`   |

모든 모델이 **같은** `OPENROUTER_API_KEY`를 사용합니다. 키는
[openrouter.ai/keys](https://openrouter.ai/keys)에서 발급받고, 모델 식별자는
[openrouter.ai/models](https://openrouter.ai/models)에서 찾아보세요. `.env`는
gitignore 처리되어 있고 `.env.sample`만 커밋됩니다.

> **팁:** `:free`로 끝나는 모델 식별자(예:
> `openrouter/openai/gpt-oss-120b:free`)는 크레딧 구매 없이 실행되며 속도 제한이
> 있습니다. `openrouter/openai/gpt-4o` 같은 유료 모델은 계정에 크레딧이 있어야
> 하고, 없으면 요청이 `402 Insufficient credits`로 실패합니다.

## Docker로 실행

```bash
cd samples/openrouter_1
docker build -t aas-openrouter .
docker run --rm --env-file .env aas-openrouter "Summarize OpenRouter in one line."
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는 위의
포그라운드 `docker run`이 종종 아무것도 출력하지 않고 exit 0으로 끝납니다. 하지만
실행 자체는 성공한 것입니다. 스크립트는 끝까지 실행되고 출력도 Docker가 모두
캡처하는데, 실시간 **attach** 스트림만 그 출력을 VM 경계에서 흘려버립니다.
**detached**로 실행하고 로그를 따라가세요:

```bash
cd samples/openrouter_1
docker build -t aas-openrouter .
docker logs -f "$(docker run -d --env-file .env aas-openrouter \
  "Summarize OpenRouter in one line.")"
```

## 로컬에서 실행

```bash
cd samples/openrouter_1
pip install -r requirements.txt
python app.py "Summarize OpenRouter in one line."
```

`python-dotenv`가 `.env`를 자동으로 불러옵니다.

---

## 실행 결과

> 모델과 실행마다 결과가 달라집니다 — LLM은 비결정적이라 표현이 매번 다릅니다.
> 아래는 `openrouter/openai/gpt-oss-120b:free`로 실행한 한 예입니다.

```text
OpenRouter is an AI gateway that aggregates multiple language model providers into a single, unified API for easy, cost‑effective access to diverse LLMs.
```
