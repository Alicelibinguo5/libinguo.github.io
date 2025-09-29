from typing import List, Optional

from fastapi import APIRouter, HTTPException

from ..models import Project


router = APIRouter()


# Demo in-memory projects. Replace with DB or file in production.
PROJECTS: List[Project] = [
	Project(
		id=1,
		title="Portfolio Website",
		description="This site showcasing my work using FastAPI and React.",
		tags=["FastAPI", "React", "Vite", "Tailwind"],
		github_url="https://github.com/example/portfolio",
		live_url=None,
		image_url=None,
	),
	Project(
		id=2,
		title="Data Dashboard",
		description="Interactive analytics dashboard with charts and filters.",
		tags=["TypeScript", "D3", "API"],
		github_url="https://github.com/example/dashboard",
		live_url=None,
		image_url=None,
	),
]


@router.get("/", response_model=List[Project])
def list_projects(tag: Optional[str] = None) -> List[Project]:
	if tag:
		return [project for project in PROJECTS if tag in project.tags]
	return PROJECTS


@router.get("/{project_id}", response_model=Project)
def get_project(project_id: int) -> Project:
	for project in PROJECTS:
		if project.id == project_id:
			return project
	raise HTTPException(status_code=404, detail="Project not found")


