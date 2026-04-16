import { useState, useEffect } from 'react';
import { Alert } from '../types';
import { getAlerts } from '../api/mockApi';
import { ChevronDown, Filter } from 'lucide-react';

interface AlertsTableProps {
  alerts?: Alert[];
}

export function AlertsTable({ alerts }: AlertsTableProps) {
  const [localAlerts, setLocalAlerts] = useState<Alert[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    if (alerts) {
      setLocalAlerts(alerts);
    } else {
      getAlerts().then(setLocalAlerts);
    }
  }, [alerts]);

  const filteredAlerts = localAlerts.filter(alert => 
    filterSeverity === 'all' || alert.severity === filterSeverity
  );

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Alerts</h2>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5" />
          <select 
            value={filterSeverity} 
            onChange={(e) => setFilterSeverity(e.target.value as any)}
            className="bg-gray-700 text-white px-3 py-2 rounded-lg"
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Camera</th>
              <th className="p-4 text-left">Severity</th>
              <th className="p-4 text-left">Timestamp</th>
              <th className="p-4 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map((alert) => (
              <tr key={alert.id} className="border-t border-gray-700 hover:bg-gray-750">
                <td className="p-4 font-medium">{alert.type}</td>
                <td className="p-4">{alert.cameraId}</td>
                <td className={`p-4 ${
                  alert.severity === 'high' ? 'text-red-400' :
                  alert.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {alert.severity.toUpperCase()}
                </td>
                <td className="p-4">{alert.timestamp}</td>
                <td className="p-4">{alert.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredAlerts.length === 0 && (
        <div className="p-8 text-center text-gray-500">No alerts match the filter</div>
      )}
    </div>
  );
}