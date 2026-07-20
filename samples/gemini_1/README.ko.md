# Google Gemini — 최소 생성 호출

아주 작은 [Gemini](https://ai.google.dev/gemini-api/docs) 스크립트입니다.
`google-genai` SDK로 프롬프트 하나를 Gemini 모델에 보내고 응답을 출력합니다.

## 설정

```bash
cd samples/gemini_1
cp .env.sample .env
# .env 편집: GEMINI_API_KEY 설정 (필요하면 MODEL도)
```

키는 [aistudio.google.com](https://aistudio.google.com)에서 발급받으세요 — 무료 티어가 있습니다.
`MODEL` 기본값은 `gemini-2.5-flash`입니다. `.env`는 gitignore 처리되어 있고,
`.env.sample`만 커밋됩니다.

## Docker로 실행

```bash
cd samples/gemini_1
docker build -t aas-gemini .
docker run --rm --env-file .env aas-gemini "Summarize Gemini in one line."
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는 위의
포그라운드 `docker run`이 종종 아무것도 출력하지 않고 exit 0으로 끝납니다. 하지만
실행 자체는 성공한 것입니다. 스크립트는 끝까지 실행되고 출력도 Docker가 모두
캡처하는데, 실시간 **attach** 스트림만 그 출력을 VM 경계에서 흘려버립니다. 같은
컨테이너에 `docker logs`를 실행하면 전체 출력이 그대로 보이고, 컨테이너는 exit 0으로
끝나며 OOM도 아닙니다. **detached**로 실행하고 로그를 따라가세요:

```bash
cd samples/gemini_1
docker build -t aas-gemini .
docker logs -f "$(docker run -d --env-file .env aas-gemini \
  "Summarize Gemini in one line.")"
```

## 로컬에서 실행

```bash
cd samples/gemini_1
pip install -r requirements.txt
python app.py "Summarize Gemini in one line."
```

`python-dotenv`가 `.env`를 자동으로 불러옵니다.

---

## 실행 결과

> 모델과 실행마다 결과가 달라집니다 — LLM은 비결정적이라 표현이 매번 다릅니다.
> 아래는 `gemini-2.5-flash`로 실행한 한 예입니다.

```text
Google Gemini is Google's multimodal AI model designed to understand, process,
and generate various forms of information, including text, images, audio, and
video.
```
