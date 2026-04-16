import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import asyncio
from .database import init_db, get_cameras, get_alerts, get_analytics
from .video import video_ingestion_loop
from .schemas import (
    Camera, Alert, Analytics, AnalyticsByType, AnalyticsByCamera
)

app = FastAPI(title="PPE Violation Detection")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections[:]:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                self.active_connections.remove(connection)

manager = ConnectionManager()

@app.on_event("startup")
async def startup_event():
    init_db()
    asyncio.create_task(video_ingestion_loop(manager.broadcast))

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            _ = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/api/cameras", response_model=List[Camera])
async def read_cameras():
    cams = get_cameras()
    return [Camera.model_validate(cam) for cam in cams]

@app.get("/api/alerts", response_model=List[Alert])
async def read_alerts(
    limit: int = Query(default=50, ge=1, le=100),
    camera: Optional[str] = None,
    status: Optional[str] = None
):
    alerts = get_alerts(limit=limit, camera=camera, status=status)
    return [Alert.model_validate(alert) for alert in alerts]

@app.get("/api/analytics", response_model=Analytics)
async def read_analytics():
    analytics_data = get_analytics()
    analytics_data["by_type"] = [AnalyticsByType.model_validate(bt) for bt in analytics_data["by_type"]]
    analytics_data["by_camera"] = [AnalyticsByCamera.model_validate(bc) for bc in analytics_data["by_camera"]]
    return Analytics.model_validate(analytics_data)
