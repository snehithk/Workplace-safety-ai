from pydantic import BaseModel
from typing import List, Optional

class Camera(BaseModel):
    id: str
    name: str
    zone: str
    status: str
    violation_count: int
    last_violation: Optional[str] = None

class Alert(BaseModel):
    id: int
    type: str
    camera: str
    zone: str
    timestamp: str
    confidence: float
    status: str

class AnalyticsByType(BaseModel):
    type: str
    count: int

class AnalyticsByCamera(BaseModel):
    camera: str
    count: int

class Analytics(BaseModel):
    total_alerts: int
    by_type: List[AnalyticsByType]
    by_camera: List[AnalyticsByCamera]
    last_24h: int
