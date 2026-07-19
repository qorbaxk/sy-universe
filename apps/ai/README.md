# sy-universe AI guide

포트폴리오 콘텐츠(`apps/web/public`)를 인덱싱하는 가벼운 RAG + SSE 챗봇입니다.
외부 LLM 키 없이도 문서 기반 extractive 답변을 스트리밍합니다.

## Run

```bash
cd apps/ai
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

루트에서는 `npm run dev:ai`를 사용할 수 있습니다.

Nest BFF는 `AI_SERVICE_URL`(기본 `http://127.0.0.1:8000`)로 이 서비스를 프록시합니다.
