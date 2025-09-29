from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from ..services.resume_parser import extract_resume_text, parse_resume_text

router = APIRouter()


def _get_resume_path() -> Path:
	# Project root is three levels up from this file: backend/app/routers -> project root
	project_root = Path(__file__).resolve().parents[3]
	return project_root / "Libin_Guo_Data_Resume.docx.pdf"


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


