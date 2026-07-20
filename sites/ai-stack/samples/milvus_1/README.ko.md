# Milvus Lite — 임베디드 벡터 검색

**Milvus Lite**를 쓰는 아주 작은 [Milvus](https://milvus.io) 스크립트입니다.
컬렉션을 만들고 벡터 몇 개를 넣은 뒤 유사도 검색으로 가장 가까운 행을 출력합니다.
로컬 파일에서 임베디드로 동작해 서버·API 키·네트워크가 필요 없고, 출력이
결정적입니다.

## Docker로 실행

```bash
cd samples/milvus_1
docker build -t aas-milvus .
docker run --rm aas-milvus
```

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는 위의
포그라운드 `docker run`이 종종 아무것도 출력하지 않고 exit 0으로 끝납니다. 하지만
실행 자체는 성공한 것입니다. **detached**로 실행하고 로그를 따라가세요:

```bash
cd samples/milvus_1
docker build -t aas-milvus .
docker logs -f "$(docker run -d aas-milvus)"
```

## 로컬에서 실행

```bash
cd samples/milvus_1
pip install -r requirements.txt
python app.py
```

같은 `MilvusClient` API가 Milvus Lite에서 셀프호스트 Milvus 클러스터나 Zilliz
Cloud까지 확장됩니다 — 파일 경로 대신 서버 URI만 넘기면 됩니다.

---

## 실행 결과

> Milvus Lite는 로컬에서 동작하고 이 샘플은 결정적이라, 출력이 매번 동일합니다.

```text
nearest: Cats are independent pets that purr.
```
