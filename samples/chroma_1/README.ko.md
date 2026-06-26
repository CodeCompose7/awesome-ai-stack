# Chroma — 벡터 유사도 검색 (서버·키 불필요)

아주 작은 [Chroma](https://www.trychroma.com) 데모입니다. 문서 몇 개를 저장하면
Chroma가 내장 모델로 임베딩하고, 최근접 이웃 질의를 실행합니다. 장난감 문서를 직접
바꾸면 RAG 검색기가 됩니다. API 키가 필요 없습니다.

## Docker로 실행

```bash
cd samples/chroma_1
docker build -t aas-chroma .
docker run --rm aas-chroma "tell me about young cats"
```

첫 질의 때 Chroma의 내장 임베딩 모델(`all-MiniLM-L6-v2`, 약 80 MB)을 받으므로 한
번은 인터넷이 필요합니다.

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는 attach된
`docker run`이 실제로 실행했는데도 출력을 안 보여줄 수 있습니다. 실시간 attach
스트림이 VM 경계에서 출력을 흘려버리기 때문이니, **detached**로 실행하고 로그로
확인하세요:

```bash
cd samples/chroma_1
docker build -t aas-chroma .
docker logs -f "$(docker run -d aas-chroma "tell me about young cats")"
```

## 로컬에서 실행

```bash
cd samples/chroma_1
pip install -r requirements.txt
python app.py "tell me about young cats"
```

---

## 실행 결과

> 임베딩은 고정 모델 + 입력이라 결정적입니다. 그래서 순위는 매번 같고, 첫 실행에서만
> 모델을 내려받습니다.

```text
nearest to 'tell me about young cats' by distance:
  kitten     0.8413
  cat        1.0233
  rocket     1.8533
```
