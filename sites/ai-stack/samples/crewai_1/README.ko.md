# CrewAI — 한 명짜리 crew

아주 작은 [CrewAI](https://www.crewai.com) 스크립트입니다. 에이전트(역할 + 목표)와
작업을 정의해 Crew로 묶고 `kickoff`으로 실행합니다.

## 설정

```bash
cd samples/crewai_1
cp .env.sample .env
# .env 편집: ANTHROPIC_API_KEY 설정
```

CrewAI 1.x는 **네이티브 모델 provider**를 쓰므로, 이 샘플은 `crewai[anthropic]`을
설치하고 `anthropic/claude-opus-4-8`을 기본으로 합니다. 다른 제공자를 쓰려면 해당
extra(예: `crewai[openai]`)를 추가하고 `MODEL`을 바꾸세요. `.env`는 gitignore 처리되어
있고, `.env.sample`만 커밋됩니다.

## Docker로 실행

```bash
cd samples/crewai_1
docker build -t aas-crewai .
docker run --rm --env-file .env aas-crewai "CrewAI"
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는 위의
포그라운드 `docker run`이 종종 아무것도 출력하지 않고 exit 0으로 끝납니다. 하지만
실행 자체는 성공한 것입니다. 스크립트는 끝까지 실행되고 출력도 Docker가 모두
캡처하는데, 실시간 **attach** 스트림만 그 출력을 VM 경계에서 흘려버립니다.
**detached**로 실행하고 로그를 따라가세요:

```bash
cd samples/crewai_1
docker build -t aas-crewai .
docker logs -f "$(docker run -d --env-file .env aas-crewai "CrewAI")"
```

## 로컬에서 실행

```bash
cd samples/crewai_1
pip install -r requirements.txt
python app.py "CrewAI"
```

`python-dotenv`가 `.env`를 자동으로 불러옵니다.

---

## 실행 결과

> 모델과 실행마다 결과가 달라집니다 — LLM은 비결정적이라 표현이 매번 다릅니다.
> 아래는 `anthropic/claude-opus-4-8`로 실행한 한 예입니다.

```text
CrewAI is an open-source framework for orchestrating multiple AI agents that
collaborate as a coordinated team to automate complex tasks.
```
