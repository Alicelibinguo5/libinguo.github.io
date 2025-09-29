from typing import List, Optional

from pydantic import BaseModel, EmailStr, HttpUrl


class Project(BaseModel):
	id: int
	title: str
	description: str
	tags: List[str] = []
	github_url: Optional[HttpUrl] = None
	live_url: Optional[HttpUrl] = None
	image_url: Optional[HttpUrl] = None


class ContactMessage(BaseModel):
	name: str
	email: EmailStr
	subject: str
	message: str


class BlogPost(BaseModel):
    slug: str
    title: str
    summary: str
    content: str
    created_at: str


class BlogPostCreate(BaseModel):
    title: str
    summary: str
    content: str


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None


