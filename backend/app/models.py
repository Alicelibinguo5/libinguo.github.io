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


