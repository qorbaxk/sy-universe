from __future__ import annotations

import asyncio
import json
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from .rag import PortfolioRag, stream_tokens

app = FastAPI(title="sy-universe portfolio guide", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

rag = PortfolioRag()


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    sessionId: Optional[str] = Field(default=None, max_length=64)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "chunks": str(len(rag.chunks))}


@app.post("/chat/stream")
async def chat_stream(body: ChatRequest) -> StreamingResponse:
    answer, citations = rag.answer(body.message)

    async def event_generator():
        meta = {"type": "meta", "citations": citations, "sessionId": body.sessionId}
        yield f"data: {json.dumps(meta, ensure_ascii=False)}\n\n"
        for token in stream_tokens(answer):
            payload = {"type": "token", "text": token}
            yield f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"
            await asyncio.sleep(0.015)
        yield f"data: {json.dumps({'type': 'done'}, ensure_ascii=False)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
