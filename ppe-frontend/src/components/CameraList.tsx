import { useState, useEffect } from 'react';
import { Camera } from '../types';
import { getCameras } from '../api/mockApi';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function CameraList() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCameras().then(setCameras).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-white">Loading cameras...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cameras.map((camera) => (
        <div key={camera.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">{camera.name}</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              camera.status === 'OK' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {camera.status}
            </div>
          </div>
          <p className="text-gray-400 mb-2">Zone: {camera.zone} | Plant: {camera.plant}</p>
          <p className="text-sm text-gray-500">Last Violation: {camera.lastViolation}</p>
          {camera.status === 'VIOLATIONS' && (
            <AlertCircle className="w-5 h-5 text-red-500 mt-2" />
          )}
        </div>
      ))}
    </div>
  );
}