# Portfolio Website

## Prerequisites
- Python 3.10+
- Node.js 18+

## Folder structure
- `backend/`: FastAPI application
- `frontend/`: React + Vite + TypeScript + Tailwind

## Backend setup
```
cd backend
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

Run dev server (API only):
```
uvicorn app.main:app --reload
```

Or run via module entrypoint (also serves built frontend if `frontend/dist` exists):
```
python -m app
```

## Frontend setup
```
cd frontend
npm install
npm run dev
```

## Build frontend and serve via FastAPI
```
cd frontend && npm run build
```

Then start the backend; FastAPI will serve files from `frontend/dist` if present:
```
cd backend
python -m app  # or: uvicorn app.main:app
```

Open: http://localhost:8000

## Environment
- Optionally set `VITE_API_URL` in `frontend/.env` during development, e.g. `VITE_API_URL=http://localhost:8000`.
