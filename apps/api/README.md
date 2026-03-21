# API (FastAPI)

## Setup

```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
```

Or with [uv](https://github.com/astral-sh/uv):

```bash
cd apps/api
uv sync --extra dev
```

## Run

```bash
pnpm dev
# or: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open http://localhost:8000/docs for OpenAPI.
