# PPE Violation Detection Backend

A FastAPI backend for simulating PPE violations with synthetic data ingestion, SQLite storage, REST APIs, and WebSocket streaming.

## Installation

```bash
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## API

- `GET /api/cameras` - List cameras with status
- `GET /api/alerts?limit=50&camera=cam-001&status=Active` - List recent alerts
- `GET /api/analytics` - Summary stats
- `WS /ws` - Stream new violations

Database: `violations.db` created automatically.
