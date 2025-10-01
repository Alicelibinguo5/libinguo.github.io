from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import MetaData, Table, Column, String, Text, Boolean, TIMESTAMP, text, select, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine

from ..models import BlogPost, BlogPostCreate, BlogPostUpdate


router = APIRouter()


class Db:
    engine: Optional[AsyncEngine] = None
    table: Optional[Table] = None


def _get_engine() -> AsyncEngine:
    if Db.engine is None:
        import os
        dsn = os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL")
        if not dsn:
            raise RuntimeError("DATABASE_URL not configured")
        # Render provides DATABASE_URL; use asyncpg scheme
        if dsn.startswith("postgres://"):
            dsn = dsn.replace("postgres://", "postgresql+asyncpg://", 1)
        elif dsn.startswith("postgresql://"):
            dsn = dsn.replace("postgresql://", "postgresql+asyncpg://", 1)
        Db.engine = create_async_engine(dsn, pool_pre_ping=True)
    return Db.engine


def _get_table() -> Table:
    if Db.table is None:
        metadata = MetaData()
        Db.table = Table(
            "blog_posts",
            metadata,
            Column("slug", String(200), primary_key=True),
            Column("title", String(300), nullable=False),
            Column("summary", String(1000), nullable=False),
            Column("content", Text, nullable=False),
            Column("tags", JSONB, nullable=True),
            Column("published", Boolean, server_default=text("true")),
            Column("created_at", TIMESTAMP(timezone=True), server_default=text("now()")),
            Column("updated_at", TIMESTAMP(timezone=True), server_default=text("now()"), onupdate=text("now()")),
        )
    return Db.table


@router.on_event("startup")
async def init_table() -> None:
    import os
    engine = _get_engine()
    table = _get_table()
    async with engine.begin() as conn:
        await conn.run_sync(table.metadata.create_all)
        # Optional seed once when table is empty
        if (os.getenv("SEED_BLOG", "false").lower() in {"1", "true", "yes"}):
            count = (await conn.execute(select(func.count()).select_from(table))).scalar_one()
            if count == 0:
                await conn.execute(table.insert().values([
                    {
                        "slug": "hello-world",
                        "title": "Hello, world",
                        "summary": "Welcome to my blog — first post seeded for demo.",
                        "content": "This is a sample post created during initial seeding.",
                    },
                    {
                        "slug": "real-time-ads-metrics-pipeline",
                        "title": "A Minimal Real‑Time Ads Metrics Pipeline",
                        "summary": "Kafka → Flink → Iceberg → Superset: pragmatic baseline.",
                        "content": "Notes on design trade‑offs, checkpoints, and dashboarding.",
                    },
                ]))


def _slugify(title: str) -> str:
    s = "".join(ch.lower() if ch.isalnum() else "-" for ch in title).strip("-")
    while "--" in s:
        s = s.replace("--", "-")
    return s


@router.get("/", response_model=List[BlogPost])
async def list_posts() -> List[BlogPost]:
    engine = _get_engine()
    table = _get_table()
    async with engine.connect() as conn:
        rows = (await conn.execute(table.select().order_by(table.c.created_at.desc()))).mappings().all()
        return [BlogPost(**{**row, "created_at": row["created_at"].isoformat() if row["created_at"] else ""}) for row in rows]


@router.get("/{slug}", response_model=BlogPost)
async def get_post(slug: str) -> BlogPost:
    engine = _get_engine()
    table = _get_table()
    async with engine.connect() as conn:
        row = (await conn.execute(table.select().where(table.c.slug == slug))).mappings().first()
        if not row:
            raise HTTPException(status_code=404, detail="Post not found")
        return BlogPost(**{**row, "created_at": row["created_at"].isoformat() if row["created_at"] else ""})


@router.post("/", response_model=BlogPost)
async def create_post(payload: BlogPostCreate) -> BlogPost:
    engine = _get_engine()
    table = _get_table()
    slug = _slugify(payload.title)
    async with engine.begin() as conn:
        exists = (await conn.execute(table.select().where(table.c.slug == slug))).first()
        if exists:
            raise HTTPException(status_code=400, detail="Slug already exists")
        await conn.execute(table.insert().values(
            slug=slug,
            title=payload.title,
            summary=payload.summary,
            content=payload.content,
        ))
    return await get_post(slug)


@router.put("/{slug}", response_model=BlogPost)
async def update_post(slug: str, payload: BlogPostUpdate) -> BlogPost:
    engine = _get_engine()
    table = _get_table()
    async with engine.begin() as conn:
        row = (await conn.execute(table.select().where(table.c.slug == slug))).first()
        if not row:
            raise HTTPException(status_code=404, detail="Post not found")
        update_values = {}
        if payload.title is not None:
            update_values["title"] = payload.title
        if payload.summary is not None:
            update_values["summary"] = payload.summary
        if payload.content is not None:
            update_values["content"] = payload.content
        if update_values:
            await conn.execute(table.update().where(table.c.slug == slug).values(**update_values))
    return await get_post(slug)


@router.delete("/{slug}", response_model=dict)
async def delete_post(slug: str) -> dict:
    engine = _get_engine()
    table = _get_table()
    async with engine.begin() as conn:
        result = await conn.execute(table.delete().where(table.c.slug == slug))
        if result.rowcount == 0:  # type: ignore[attr-defined]
            raise HTTPException(status_code=404, detail="Post not found")
    return {"ok": True}


@router.get("/backup", response_model=list[BlogPost])
async def backup_posts() -> list[BlogPost]:
    return await list_posts()


class RestoreItem(BaseModel):
    slug: str
    title: str
    summary: str
    content: str
    created_at: Optional[str] = None


@router.post("/restore", response_model=dict)
async def restore_posts(payload: list[RestoreItem]) -> dict:
    engine = _get_engine()
    table = _get_table()
    async with engine.begin() as conn:
        await conn.execute(table.delete())
        for p in payload:
            await conn.execute(table.insert().values(
                slug=p.slug,
                title=p.title,
                summary=p.summary,
                content=p.content,
            ))
    return {"ok": True, "count": len(payload)}


