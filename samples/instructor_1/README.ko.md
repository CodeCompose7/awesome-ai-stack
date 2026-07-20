# instructor — LLM에서 구조화 출력

아주 작은 [instructor](https://python.useinstructor.com) 스크립트입니다. 자유
텍스트에서 타입이 있는 `Person`(name·age·occupation)을 추출합니다. Pydantic 모델을
정의하면 파싱할 문자열이 아니라 검증된 객체를 돌려받습니다. `from_litellm`이 호출을
라우팅하므로 `MODEL`이 제공자를 결정합니다.

## 설정

```bash
cd samples/instructor_1
cp .env.sample .env
# .env 편집: MODEL과 해당 제공자의 키를 설정
```

`MODEL`은 LiteLLM 형식 이름입니다:

| 제공자            | `MODEL` 예시                | `.env`의 키          |
| ----------------- | --------------------------- | ------------------- |
| Anthropic Claude  | `anthropic/claude-opus-4-8` | `ANTHROPIC_API_KEY` |
| OpenAI            | `openai/gpt-4o`             | `OPENAI_API_KEY`    |
| Google AI Studio  | `gemini/gemini-2.5-flash`   | `GEMINI_API_KEY`    |

`.env`는 gitignore 처리되어 있고, `.env.sample`만 커밋됩니다.

## Docker로 실행

```bash
cd samples/instructor_1
docker build -t aas-instructor .
docker run --rm --env-file .env aas-instructor \
  "Ada Lovelace, 36, was a mathematician and the first programmer."
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는 위의
포그라운드 `docker run`이 종종 아무것도 출력하지 않고 exit 0으로 끝납니다. 하지만
실행 자체는 성공한 것입니다. 스크립트는 끝까지 실행되고 출력도 Docker가 모두
캡처하는데, 실시간 **attach** 스트림만 그 출력을 VM 경계에서 흘려버립니다.
**detached**로 실행하고 로그를 따라가세요:

```bash
cd samples/instructor_1
docker build -t aas-instructor .
docker logs -f "$(docker run -d --env-file .env aas-instructor \
  "Ada Lovelace, 36, was a mathematician and the first programmer.")"
```

## 로컬에서 실행

```bash
cd samples/instructor_1
pip install -r requirements.txt
python app.py "Ada Lovelace, 36, was a mathematician and the first programmer."
```

`python-dotenv`가 `.env`를 자동으로 불러옵니다.

---

## 실행 결과

> 모델과 실행마다 결과가 달라집니다 — LLM은 비결정적입니다. **형태**는 Pydantic
> 모델이 고정하고, 값은 추출됩니다. 아래는 `anthropic/claude-opus-4-8`로 실행한 한
> 예입니다.

```text
{'name': 'Ada Lovelace', 'age': 36, 'occupation': 'Mathematician'}
```
