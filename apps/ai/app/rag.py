"""Lightweight keyword RAG over portfolio content (no external LLM required)."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


@dataclass
class DocChunk:
    id: str
    source: str
    text: str
    tokens: set[str]


TOKEN_RE = re.compile(r"[a-zA-Z0-9가-힣_+#.-]{2,}")


def tokenize(text: str) -> set[str]:
    return {m.group(0).lower() for m in TOKEN_RE.finditer(text)}


def resolve_content_root() -> Path | None:
    here = Path(__file__).resolve()
    candidates = [
        here.parents[2] / "web" / "public",
        here.parents[3] / "apps" / "web" / "public",
        Path.cwd().parent / "web" / "public",
        Path.cwd() / "apps" / "web" / "public",
    ]
    for path in candidates:
        if (path / "llms.txt").exists() or (path / "content" / "portfolio.json").exists():
            return path
    return None


def _split_paragraphs(text: str, source: str, prefix: str) -> list[DocChunk]:
    parts = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    chunks: list[DocChunk] = []
    for index, part in enumerate(parts):
        chunks.append(
            DocChunk(
                id=f"{prefix}-{index}",
                source=source,
                text=part,
                tokens=tokenize(part),
            )
        )
    return chunks


def load_chunks() -> list[DocChunk]:
    root = resolve_content_root()
    if root is None:
        return [
            DocChunk(
                id="fallback",
                source="fallback",
                text="승연은 Frontend Developer이며 셀핏AI, 병원 예약, 어드민 경험을 가지고 있습니다.",
                tokens=tokenize(
                    "승연 Frontend Developer 셀핏AI 병원 예약 어드민 Nest LangGraph"
                ),
            )
        ]

    chunks: list[DocChunk] = []

    llms = root / "llms.txt"
    if llms.exists():
        chunks.extend(_split_paragraphs(llms.read_text(encoding="utf-8"), "llms.txt", "llms"))

    portfolio = root / "content" / "portfolio.json"
    if portfolio.exists():
        data = json.loads(portfolio.read_text(encoding="utf-8"))
        profile = data.get("profile", {})
        profile_text = "\n".join(
            [
                f"이름: {profile.get('name')} ({profile.get('nameEn')})",
                f"타이틀: {profile.get('title')}",
                f"헤드라인: {profile.get('headline')}",
                f"소개: {profile.get('bio')}",
                f"이메일: {profile.get('email')}",
                f"스킬 core: {', '.join(data.get('skills', {}).get('core', []))}",
                f"스킬 product: {', '.join(data.get('skills', {}).get('product', []))}",
                f"스킬 tooling: {', '.join(data.get('skills', {}).get('tooling', []))}",
            ]
        )
        chunks.extend(_split_paragraphs(profile_text, "portfolio.json", "profile"))

        for company in data.get("companies", []):
            text = (
                f"회사 {company.get('name')} / 역할 {company.get('role')}\n"
                f"{company.get('summary')}"
            )
            chunks.extend(
                _split_paragraphs(
                    text,
                    f"company:{company.get('id')}",
                    f"company-{company.get('id')}",
                )
            )

    projects_dir = root / "content" / "projects"
    manifest_path = projects_dir / "manifest.json"
    if manifest_path.exists():
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        for project_id in manifest.get("ids", []):
            path = projects_dir / f"{project_id}.json"
            if not path.exists():
                continue
            project = json.loads(path.read_text(encoding="utf-8"))
            lines = [
                f"프로젝트: {project.get('name')} ({project.get('id')})",
                f"회사: {project.get('company')}",
                f"요약: {project.get('summary')}",
                f"역할: {project.get('role', '')}",
                f"아키텍처: {project.get('architectureNote', '')}",
                "하이라이트: " + " / ".join(project.get("highlights", [])),
                "스택: " + ", ".join(project.get("stack", [])),
            ]
            for feature in project.get("features") or []:
                star = feature.get("star", {})
                lines.append(
                    f"기능 {feature.get('title')} [{feature.get('layer')}]: "
                    f"Action {star.get('action')} Result {star.get('result')}"
                )
            chunks.extend(
                _split_paragraphs(
                    "\n".join(lines),
                    f"project:{project_id}",
                    f"project-{project_id}",
                )
            )

    return chunks


class PortfolioRag:
    def __init__(self) -> None:
        self.chunks = load_chunks()

    def retrieve(self, query: str, k: int = 4) -> list[DocChunk]:
        query_tokens = tokenize(query)
        if not query_tokens:
            return self.chunks[:k]

        scored: list[tuple[int, DocChunk]] = []
        for chunk in self.chunks:
            overlap = len(query_tokens & chunk.tokens)
            boost = sum(2 for t in query_tokens if t in chunk.text.lower())
            score = overlap * 3 + boost
            if score > 0:
                scored.append((score, chunk))

        scored.sort(key=lambda item: item[0], reverse=True)
        if not scored:
            return self.chunks[:k]
        return [chunk for _, chunk in scored[:k]]

    def answer(self, query: str) -> tuple[str, list[dict[str, str]]]:
        hits = self.retrieve(query)
        citations = [{"id": c.id, "source": c.source} for c in hits]
        bullets: list[str] = []
        for chunk in hits[:3]:
            sentence = chunk.text.strip().split("\n")[0]
            if len(sentence) > 220:
                sentence = sentence[:217] + "..."
            bullets.append(f"- {sentence}")

        answer = (
            "포트폴리오 문서를 기준으로 답하면 이렇습니다.\n\n"
            + "\n".join(bullets)
            + "\n\n더 궁금한 프로젝트(셀핏 에디터/추출/AI 생성/가이드 챗봇)를 지정해 주시면 "
            "해당 노드 기준으로 더 자세히 안내할게요."
        )
        return answer, citations


def stream_tokens(text: str, chunk_size: int = 24) -> Iterable[str]:
    for index in range(0, len(text), chunk_size):
        yield text[index : index + chunk_size]
