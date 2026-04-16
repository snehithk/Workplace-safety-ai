import { useState, useEffect } from 'react';
import { CameraList } from '../components/CameraList';
import { AlertsTable } from '../components/AlertsTable';
import { getCameras, getAlerts, getAnalytics } from '../api/mockApi';
import { AlertCircle, Camera, Activity } from 'lucide-react';

export function Dashboard() {
  const [stats, setStats] = useState({ totalCameras: 0, activeAlerts: 0, violationsToday: 0 });
  const [cameras, setCameras] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);

  useEffect(() => {
    Promise.all([getCameras(), getAlerts(), getAnalytics()]).then(([cams, alerts]) => {
      setCameras(cams);
      setRecentAlerts(alerts.slice(0, 3));
      setStats({
        totalCameras: cams.length,
        activeAlerts: alerts.length,
        violationsToday: 28, // mock
      });
    });
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 rounded-xl shadow-2xl text-white">
          <div className="flex items-center mb-4">
            <Camera className="w-12 h-12 mr-4 opacity-75" />
            <div>
              <p className="text-blue-100">Total Cameras</p>
              <p className="text-4xl font-bold">{stats.totalCameras}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 rounded-xl shadow-2xl text-white">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-12 h-12 mr-4 opacity-75" />
            <div>
              <p className="text-red-100">Active Alerts</p>
              <p className="text-4xl font-bold">{stats.activeAlerts}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-xl shadow-2xl text-white">
          <div className="flex items-center mb-4">
            <Activity className="w-12 h-12 mr-4 opacity-75" />
            <div>
              <p className="text-green-100">Violations Today</p>
              <p className="text-4xl font-bold">{stats.violationsToday}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Cameras</h2>
          <CameraList />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Alerts</h2>
          <AlertsTable alerts={recentAlerts} />
        </div>
      </div>
    </div>
  );
}