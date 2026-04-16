import { useParams } from 'react-router-dom';
import { AlertTriangle, Clock, MapPin } from 'lucide-react';

export function IncidentDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-4xl">
      <div className="flex items-start gap-6 mb-8">
        <div className="bg-red-500 w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-12 h-12 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">Incident #{id}</h1>
          <p className="text-gray-400 mb-4">No Helmet - High Severity</p>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>2026-04-16 09:15</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Camera cam2 - Zone 2</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Video Evidence</h2>
          <div className="bg-gray-800 aspect-video rounded-xl flex items-center justify-center">
            <video controls className="w-full h-full rounded-xl">
              <source src="/placeholder-video.mp4" type="video/mp4" />
              Video placeholder
            </video>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Details</h2>
          <div className="bg-gray-800 p-6 rounded-xl space-y-4">
            <div>
              <p className="text-gray-400 mb-2">Description:</p>
              <p>Worker without helmet detected on Assembly Line 2.</p>
            </div>
            <div>
              <p className="text-gray-400 mb-2">Location:</p>
              <p>Plant A, Zone 2, Camera: Assembly Line 2</p>
            </div>
            <div>
              <p className="text-gray-400 mb-2">Status:</p>
              <span className="px-4 py-1 bg-yellow-500 text-white rounded-full text-sm">Under Review</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}