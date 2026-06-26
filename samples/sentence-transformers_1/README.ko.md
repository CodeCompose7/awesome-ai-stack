# Sentence Transformers — 로컬 임베딩 + 유사도

아주 작은 [Sentence Transformers](https://sbert.net) 데모입니다. 문서 몇 개와 질의를
CPU에서 임베딩한 뒤, 코사인 유사도로 문서를 정렬합니다. API 키가 필요 없습니다 —
모델이 로컬에서 돕니다.

> **무거운 이미지.** PyTorch(수 GB)를 받으므로 첫 빌드가 느립니다.

## Docker로 실행

```bash
cd samples/sentence-transformers_1
docker build -t aas-sentence-transformers .
docker run --rm aas-sentence-transformers "tell me about young cats"
```

첫 실행에서 모델(`all-MiniLM-L6-v2`, 약 80 MB)을 받으므로 한 번은 인터넷이
필요합니다. 다국어가 필요하면 `app.py`에서 `BAAI/bge-m3`로 바꾸세요.

## Docker로 실행 (DooD를 쓰는 devcontainer에서)

호스트 Docker 데몬과 통신하는 dev container(Docker-outside-of-Docker)에서는 attach된
`docker run`이 실제로 실행했는데도 출력을 안 보여줄 수 있습니다. 실시간 attach
스트림이 VM 경계에서 출력을 흘려버리기 때문이니, **detached**로 실행하고 로그로
확인하세요:

```bash
cd samples/sentence-transformers_1
docker build -t aas-sentence-transformers .
docker logs -f "$(docker run -d aas-sentence-transformers "tell me about young cats")"
```

## 로컬에서 실행

```bash
cd samples/sentence-transformers_1
pip install -r requirements.txt
python app.py "tell me about young cats"
```

---

## 실행 결과

> 임베딩은 고정 모델 + 입력이라 결정적입니다. 그래서 순위는 매번 같고, 첫 실행에서만
> 모델을 내려받습니다.

```text
nearest to 'tell me about young cats' by cosine similarity:
  0.5793  A kitten is a young cat that loves to play and nap.
  0.4883  Cats are independent pets that purr and chase laser pointers.
  0.0734  A rocket is propelled by ejecting exhaust gas at high speed.
```
