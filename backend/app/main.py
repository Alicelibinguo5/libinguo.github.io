from pathlib import Path
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .models import ContactMessage, Project
from .routers.projects import router as projects_router
from .routers.contact import router as contact_router
from .routers.github import router as github_router
from .routers.blog import router as blog_router


def create_app() -> FastAPI:
	app = FastAPI(title="Portfolio API", version="1.0.0")

	# Configure CORS for development; adjust origins for production as needed
	app.add_middleware(
		CORSMiddleware,
		allow_origins=["*"],
		allow_credentials=True,
		allow_methods=["*"],
		allow_headers=["*"],
	)

	# API Routers
	app.include_router(projects_router, prefix="/api/projects", tags=["projects"])
	app.include_router(contact_router, prefix="/api/contact", tags=["contact"])
	app.include_router(github_router, prefix="/api/github", tags=["github"])
	app.include_router(blog_router, prefix="/api/blog", tags=["blog"])

	# Health check
	@app.get("/api/health")
	def health() -> dict:
		return {"status": "ok"}

	# Static file serving for production (frontend build)
	# Serve built assets under /assets and fallback all routes to index.html
	frontend_dist = (Path(__file__).resolve().parents[2] / "frontend" / "dist").resolve()
	if frontend_dist.exists():
		assets_dir = frontend_dist / "assets"
		if assets_dir.exists():
			app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

		@app.get("/")
		def index_root():
			index_file = frontend_dist / "index.html"
			if not index_file.exists():
				raise HTTPException(status_code=404, detail="index.html not found")
			return FileResponse(str(index_file))

		# SPA fallback for client-side routes like /contact, /projects, etc.
		@app.get("/{full_path:path}")
		def spa_fallback(full_path: str):  # type: ignore[unused-argument]
			index_file = frontend_dist / "index.html"
			if not index_file.exists():
				raise HTTPException(status_code=404, detail="index.html not found")
			return FileResponse(str(index_file))

	return app


app = create_app()


