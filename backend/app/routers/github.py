import os
from typing import Any, Dict, List, Optional

import httpx
from fastapi import APIRouter, HTTPException, Query


router = APIRouter()


GITHUB_API = "https://api.github.com"


def _headers() -> Dict[str, str]:
	headers = {"Accept": "application/vnd.github+json"}
	token = os.getenv("GITHUB_TOKEN")
	if token:
		headers["Authorization"] = f"Bearer {token}"
		headers["X-GitHub-Api-Version"] = "2022-11-28"
	return headers


@router.get("/repos")
async def list_repos(
	username: str = Query(..., description="GitHub username"),
	per_page: int = Query(12, ge=1, le=100),
	page: int = Query(1, ge=1),
) -> List[Dict[str, Any]]:
	url = f"{GITHUB_API}/users/{username}/repos"
	params = {"sort": "updated", "per_page": per_page, "page": page, "type": "owner"}
	async with httpx.AsyncClient(timeout=15.0) as client:
		resp = await client.get(url, headers=_headers(), params=params)
		if resp.status_code != 200:
			raise HTTPException(status_code=resp.status_code, detail=resp.text)
		repos = resp.json()

		# Normalize the subset we need
		result: List[Dict[str, Any]] = []
		for r in repos:
			result.append(
				{
					"id": r.get("id"),
					"name": r.get("name"),
					"full_name": r.get("full_name"),
					"html_url": r.get("html_url"),
					"description": r.get("description"),
					"language": r.get("language"),
					"stargazers_count": r.get("stargazers_count"),
					"forks_count": r.get("forks_count"),
					"updated_at": r.get("updated_at"),
					"topics": r.get("topics", []),
				}
			)
		return result


