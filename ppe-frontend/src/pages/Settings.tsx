import { API_BASE_URL, FEATURE_FLAGS, PLANTS, ZONES } from '../config';

export function Settings() {
  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="bg-gray-800 p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-6">API Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">API Base URL</label>
            <code className="bg-gray-900 px-4 py-2 rounded-lg block w-full font-mono">{API_BASE_URL}</code>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-6">Feature Flags</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(FEATURE_FLAGS).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
              <span className="font-medium">{key}</span>
              <span className={`px-3 py-1 rounded-full text-sm ${value ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                {value ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-gray-800 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6">Plants</h2>
          <ul className="space-y-2">
            {PLANTS.map(plant => (
              <li key={plant} className="flex items-center p-3 bg-gray-900 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3" />
                {plant}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-800 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6">Zones</h2>
          <ul className="space-y-2">
            {ZONES.map(zone => (
              <li key={zone} className="flex items-center p-3 bg-gray-900 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3" />
                {zone}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}