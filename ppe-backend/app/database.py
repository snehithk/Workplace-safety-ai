from typing import List, Dict, Optional
from contextlib import contextmanager
import sqlite3
from datetime import datetime, timedelta

DB_PATH = "violations.db"

CAMERAS = [
    {"id": "cam-001", "name": "Main Entrance", "zone": "Gate A"},
    {"id": "cam-002", "name": "Warehouse 1", "zone": "Storage North"},
    {"id": "cam-003", "name": "Production Line", "zone": "Assembly Hall"},
    {"id": "cam-004", "name": "Loading Dock", "zone": "Dock B"},
    {"id": "cam-005", "name": "Break Room", "zone": "Employee Lounge"},
]

@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS cameras (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                zone TEXT NOT NULL,
                status TEXT DEFAULT 'OK',
                violation_count INTEGER DEFAULT 0,
                last_violation TEXT
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                camera TEXT NOT NULL,
                zone TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                confidence REAL NOT NULL,
                status TEXT DEFAULT 'Active'
            )
        """)
    # Seed cameras if empty
    with get_db() as conn:
        if conn.execute("SELECT COUNT(*) FROM cameras").fetchone()[0] == 0:
            for cam in CAMERAS:
                conn.execute(
                    "INSERT INTO cameras (id, name, zone) VALUES (?, ?, ?)",
                    (cam["id"], cam["name"], cam["zone"])
                )

def get_cameras() -> List[Dict]:
    with get_db() as conn:
        return [dict(row) for row in conn.execute("SELECT * FROM cameras").fetchall()]

def get_alerts(limit: int = 50, camera: Optional[str] = None, status: Optional[str] = None) -> List[Dict]:
    query = "SELECT * FROM alerts"
    params = []
    where_clauses = []
    if camera:
        where_clauses.append("camera = ?")
        params.append(camera)
    if status:
        where_clauses.append("status = ?")
        params.append(status)
    if where_clauses:
        query += " WHERE " + " AND ".join(where_clauses)
    query += " ORDER BY id DESC LIMIT ?"
    params.append(limit)
    with get_db() as conn:
        return [dict(row) for row in conn.execute(query, params).fetchall()]

def get_analytics() -> Dict:
    now = datetime.utcnow()
    last24 = (now - timedelta(hours=24)).isoformat()
    with get_db() as conn:
        total = conn.execute("SELECT COUNT(*) FROM alerts").fetchone()[0]
        by_type_rows = conn.execute("SELECT type, COUNT(*) as count FROM alerts GROUP BY type").fetchall()
        by_type = [{"type": row["type"], "count": row["count"]} for row in by_type_rows]
        by_camera_rows = conn.execute("SELECT camera, COUNT(*) as count FROM alerts GROUP BY camera").fetchall()
        by_camera = [{"camera": row["camera"], "count": row["count"]} for row in by_camera_rows]
        last24_count = conn.execute("SELECT COUNT(*) FROM alerts WHERE timestamp > ?", (last24,)).fetchone()[0]
        return {
            "total_alerts": total,
            "by_type": by_type,
            "by_camera": by_camera,
            "last_24h": last24_count
        }

def update_camera_after_violation(cam_id: str, timestamp: str):
    with get_db() as conn:
        conn.execute(
            "UPDATE cameras SET status = 'VIOLATION', violation_count = violation_count + 1, last_violation = ? WHERE id = ?",
            (timestamp, cam_id)
        )

def insert_alert(alert_dict: Dict):
    with get_db() as conn:
        conn.execute(
            "INSERT INTO alerts (type, camera, zone, timestamp, confidence, status) VALUES (?, ?, ?, ?, ?, ?)",
            (
                alert_dict["type"],
                alert_dict["camera"],
                alert_dict["zone"],
                alert_dict["timestamp"],
                alert_dict["confidence"],
                alert_dict["status"]
            )
        )
