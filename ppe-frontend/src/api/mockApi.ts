import { Camera, Alert, AnalyticsData } from '../types';
import { format, subHours, subDays } from 'date-fns';

const mockCameras: Camera[] = [
  { id: 'cam1', name: 'Assembly Line 1', status: 'OK', zone: 'Zone 1', plant: 'Plant A', lastViolation: '2026-04-15 14:30' },
  { id: 'cam2', name: 'Assembly Line 2', status: 'VIOLATIONS', zone: 'Zone 2', plant: 'Plant A', lastViolation: '2026-04-16 09:15' },
  { id: 'cam3', name: 'Packaging Area', status: 'VIOLATIONS', zone: 'Zone 3', plant: 'Plant B', lastViolation: '2026-04-16 10:00' },
  { id: 'cam4', name: 'Loading Dock', status: 'OK', zone: 'Zone 4', plant: 'Plant B', lastViolation: '2026-04-14 16:45' },
];

const mockAlerts: Alert[] = [
  { id: 'alert1', cameraId: 'cam2', type: 'No Helmet', timestamp: '2026-04-16 09:15', severity: 'high', description: 'Worker without helmet detected' },
  { id: 'alert2', cameraId: 'cam3', type: 'No Gloves', timestamp: '2026-04-16 10:00', severity: 'medium', description: 'Worker handling materials without gloves' },
  { id: 'alert3', cameraId: 'cam2', type: 'No Safety Vest', timestamp: '2026-04-16 08:45', severity: 'high', description: 'Safety vest missing' },
  { id: 'alert4', cameraId: 'cam1', type: 'No Glasses', timestamp: '2026-04-15 14:30', severity: 'low', description: 'Eye protection missing briefly' },
];

const mockAnalytics: AnalyticsData = {
  violationsByType: {
    'No Helmet': 12,
    'No Gloves': 8,
    'No Safety Vest': 5,
    'No Glasses': 3,
  },
  violationsByCamera: {
    'cam1': 3,
    'cam2': 10,
    'cam3': 8,
    'cam4': 7,
  },
};

export const getCameras = async (): Promise<Camera[]> => mockCameras;
export const getAlerts = async (): Promise<Alert[]> => mockAlerts;
export const getAnalytics = async (): Promise<AnalyticsData> => mockAnalytics;
export const getAlertById = async (id: string): Promise<Alert | undefined> => mockAlerts.find(a => a.id === id);