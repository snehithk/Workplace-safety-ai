export interface Camera {
  id: string;
  name: string;
  status: 'OK' | 'VIOLATIONS';
  zone: string;
  plant: string;
  lastViolation: string;
}

export interface Alert {
  id: string;
  cameraId: string;
  type: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface AnalyticsData {
  violationsByType: Record<string, number>;
  violationsByCamera: Record<string, number>;
}