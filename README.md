# Portfolio Website

Personal portfolio with a modern React frontend and a FastAPI backend.

## What’s included
- Frontend (Vite + React + TS + Tailwind)
  - Home with value proposition and social links
  - Projects page (GitHub repo fetch, starred-only filter, tags, featured pin)
  - Blog with create/edit/delete, formatting toolbar (bold/italic/code), paste‑to‑image, and optional S3 image upload
  - About with embedded resume (bundled PDF)
  - Contact form (to FastAPI) and visible email/LinkedIn/GitHub
  - GitHub Pages friendly (hash routing, base path configured)
- Backend (FastAPI)
  - `/api/health` health check
  - `/api/github/*` GitHub proxy for repos
  - `/api/contact/*` contact submission endpoint
  - `/api/resume` serve resume PDF (optional if using bundled PDF)
  - `/api/blog/*` Postgres‑backed blog CRUD (sync SQLAlchemy + psycopg binary)
  - `/api/uploads/presign` S3 presigned upload for images

## Get started (local)
Prereqs: Python 3.10+ and Node.js 18+

1) Backend
```
cd backend
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt

# If using local Postgres via Docker (recommended)
docker run --name portfolio-pg \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=portfolio \
  -p 5433:5432 -d postgres:16

export DATABASE_URL=postgresql://postgres:postgres@localhost:5433/portfolio
# (optional, seeds two demo posts if table empty)
export SEED_BLOG=true

uvicorn app.main:app --reload --port 8000
```

2) Frontend (dev server)
```
cd frontend
npm install
# point frontend to your local API
VITE_API_URL=http://localhost:8000 npm run dev
```
Open the printed URL (e.g., http://localhost:5173/#/).

3) Serve built frontend from the backend (optional)
```
cd frontend && npm run build
cd ../backend && uvicorn app.main:app --reload --port 8000
# Visit http://localhost:8000/#/
```

## Deploy
- Frontend: GitHub Pages via Actions (hash routing; set Vite base to your repo path)
- Backend: Render Web Service

Recommended env for backend on Render:
```
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>[?sslmode=require|disable]
AWS_REGION=<region>
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
S3_BUCKET=<bucket-name>
# Optional CDN base for public URLs
S3_PUBLIC_BASE=https://<your-cdn-domain>
# Optional one-time seed
SEED_BLOG=true
```

Recommended env for Pages build (repo secrets):
```
VITE_API_URL=https://api.<your-domain>.com
VITE_LINKEDIN_URL=https://www.linkedin.com/in/libinguo/
VITE_CONTACT_EMAIL=libinguo89@gmail.com
```

## Folder structure
- `backend/`: FastAPI application
- `frontend/`: React + Vite + TypeScript + Tailwind

