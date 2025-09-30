import os
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from ..services.resume_parser import extract_resume_text, parse_resume_text

router = APIRouter()


def _get_resume_path() -> Path:
    """Resolve resume path with env override and multiple fallbacks.

    Priority:
    1) RESUME_FILE env (absolute or relative to project root)
    2) Project root + default filename
    3) Backend root + default filename
    """
    default_name = "resume.pdf"
    # Paths
    routers_dir = Path(__file__).resolve().parent
    app_dir = routers_dir.parent
    backend_root = app_dir.parent
    project_root = backend_root.parent

    env_value = os.getenv("RESUME_FILE")
    candidates: list[Path] = []
    if env_value:
        p = Path(env_value)
        candidates.append(p if p.is_absolute() else (project_root / p))
    candidates.append(project_root / default_name)
    candidates.append(backend_root / default_name)

    for c in candidates:
        if c.exists():
            return c
    # Fallback to a non-existing path under project root to keep type stable
    return candidates[0] if candidates else (project_root / default_name)


@router.get("/", response_class=FileResponse)
def get_resume() -> FileResponse:
	resume_path = _get_resume_path()
	if not resume_path.exists():
		raise HTTPException(status_code=404, detail="Resume PDF not found")
	return FileResponse(
		path=str(resume_path),
		media_type="application/pdf",
		filename="Libin_Guo_Resume.pdf",
	)


@router.get("/parsed")
def get_parsed_resume() -> dict:
	resume_path = _get_resume_path()
	if not resume_path.exists():
		raise HTTPException(status_code=404, detail="Resume PDF not found")
	text = extract_resume_text(resume_path)
	parsed = parse_resume_text(text)
	return {
		"summary": parsed.summary,
		"skills": parsed.skills,
		"education": parsed.education,
		"experience_snippets": parsed.experience_snippets,
	}


