import random
import asyncio
from datetime import datetime
from .database import insert_alert, update_camera_after_violation

CAMERAS = [
    {"id": "cam-001", "name": "Main Entrance", "zone": "Gate A"},
    {"id": "cam-002", "name": "Warehouse 1", "zone": "Storage North"},
    {"id": "cam-003", "name": "Production Line", "zone": "Assembly Hall"},
    {"id": "cam-004", "name": "Loading Dock", "zone": "Dock B"},
    {"id": "cam-005", "name": "Break Room", "zone": "Employee Lounge"},
]

VIOLATION_TYPES = ["PPE Missing", "Safety Violation", "Unauthorized Access", "Hazard Detected"]

def generate_violation() -> dict:
    cam = random.choice(CAMERAS)
    vtype = random.choice(VIOLATION_TYPES)
    conf = round(random.uniform(0.85, 0.98), 2)
    alert = {
        "type": vtype,
        "camera": cam["id"],
        "zone": cam["zone"],
        "timestamp": datetime.utcnow().isoformat(),
        "confidence": conf,
        "status": "Active",
    }
    insert_alert(alert)
    update_camera_after_violation(cam["id"], alert["timestamp"])
    return alert

async def video_ingestion_loop(broadcast_callback):
    while True:
        await asyncio.sleep(random.uniform(1, 3))
        if random.random() < 0.3:
            alert = generate_violation()
            await broadcast_callback(alert)
