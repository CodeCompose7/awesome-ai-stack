# pgvector — Postgres 안의 벡터 유사도 검색

아주 작은 [pgvector](https://github.com/pgvector/pgvector) 데모입니다. `vector`
컬럼을 만들고, 3차원 장난감 "임베딩" 몇 개를 저장한 뒤, 코사인 거리 연산자
(`<=>`)로 최근접 이웃을 조회합니다. 장난감 벡터를 임베딩 모델의 출력으로 바꾸면
SQL은 그대로입니다.

## Docker Compose로 실행 (Postgres 포함)

compose 파일이 `pgvector/pgvector` Postgres를 띄우고 그 위에서 앱을 실행합니다:

```bash
cd samples/pgvector_1
docker compose up --build
```

예상 출력:

```text
nearest to 'cat' by cosine distance:
  cat        0.0000  (query)
  kitten     0.0129
  rocket     0.8901
  airplane   0.9901
```

`docker-compose.yml`의 질의어(`command: ["cat"]`)를 바꿔 보세요 — `rocket`으로
하면 이웃이 바뀝니다.

## Docker Compose로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는
attach된 `docker compose up`이 앱을 실제로 실행했는데도 출력을 보여주지 않을 수
있습니다. 실시간 attach 스트림이 VM 경계에서 출력을 흘려버리기 때문이니, 로그로
다시 확인하세요:

```bash
cd samples/pgvector_1
docker compose up --build -d
docker compose logs -f app
docker compose down -v
```

## 로컬에서 실행

`vector` 확장을 쓸 수 있는 Postgres로 `DATABASE_URL`을 지정하세요:

```bash
cd samples/pgvector_1
cp .env.sample .env          # 필요하면 DATABASE_URL 수정
pip install -r requirements.txt
python app.py cat
```

`.env`는 gitignore 처리되어 있고, `.env.sample`만 커밋됩니다.
