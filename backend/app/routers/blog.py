from __future__ import annotations

import json
import os
from datetime import datetime
from pathlib import Path
from typing import List

from fastapi import APIRouter, HTTPException

from ..models import BlogPost, BlogPostCreate, BlogPostUpdate


router = APIRouter()

DATA_DIR = Path(os.getenv("BLOG_DATA_DIR", str(Path(__file__).resolve().parents[2] / "data")))
DATA_DIR.mkdir(parents=True, exist_ok=True)
POSTS_FILE = DATA_DIR / "blog_posts.json"


def _load_posts() -> List[BlogPost]:
    if not POSTS_FILE.exists():
        return []
    with POSTS_FILE.open("r", encoding="utf-8") as f:
        data = json.load(f)
    return [BlogPost(**p) for p in data]


def _save_posts(posts: List[BlogPost]) -> None:
    with POSTS_FILE.open("w", encoding="utf-8") as f:
        json.dump([p.dict() for p in posts], f, ensure_ascii=False, indent=2)


def _slugify(title: str) -> str:
    s = "".join(ch.lower() if ch.isalnum() else "-" for ch in title).strip("-")
    while "--" in s:
        s = s.replace("--", "-")
    return s


@router.get("/", response_model=List[BlogPost])
def list_posts() -> List[BlogPost]:
    return _load_posts()


@router.get("/{slug}", response_model=BlogPost)
def get_post(slug: str) -> BlogPost:
    for p in _load_posts():
        if p.slug == slug:
            return p
    raise HTTPException(status_code=404, detail="Post not found")


@router.post("/", response_model=BlogPost)
def create_post(payload: BlogPostCreate) -> BlogPost:
    posts = _load_posts()
    slug = _slugify(payload.title)
    if any(p.slug == slug for p in posts):
        raise HTTPException(status_code=400, detail="Slug already exists")
    post = BlogPost(
        slug=slug,
        title=payload.title,
        summary=payload.summary,
        content=payload.content,
        created_at=datetime.utcnow().isoformat() + "Z",
    )
    posts.insert(0, post)
    _save_posts(posts)
    return post


@router.put("/{slug}", response_model=BlogPost)
def update_post(slug: str, payload: BlogPostUpdate) -> BlogPost:
    posts = _load_posts()
    for i, p in enumerate(posts):
        if p.slug == slug:
            updated = p.copy(update={
                "title": payload.title if payload.title is not None else p.title,
                "summary": payload.summary if payload.summary is not None else p.summary,
                "content": payload.content if payload.content is not None else p.content,
            })
            posts[i] = updated
            _save_posts(posts)
            return updated
    raise HTTPException(status_code=404, detail="Post not found")


@router.delete("/{slug}", response_model=dict)
def delete_post(slug: str) -> dict:
    posts = _load_posts()
    new_posts = [p for p in posts if p.slug != slug]
    if len(new_posts) == len(posts):
        raise HTTPException(status_code=404, detail="Post not found")
    _save_posts(new_posts)
    return {"ok": True}


# --- backup/restore ---

@router.get("/backup", response_model=list[BlogPost])
def backup_posts() -> list[BlogPost]:
    return _load_posts()


@router.post("/restore", response_model=dict)
def restore_posts(payload: list[BlogPost]) -> dict:
    # naive overwrite restore; in real apps add auth/validation
    posts = [BlogPost(**p.dict() if hasattr(p, 'dict') else p) for p in payload]  # type: ignore[arg-type]
    _save_posts(posts)
    return {"ok": True, "count": len(posts)}


