import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, BarChart3, Settings, Video } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/incident/1', label: 'Incident Detail', icon: Video },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">PPE Monitor</h1>
      </div>
      <nav className="flex-1">
        <ul>
          {navItems.map(({ path, label, icon: Icon }) => (
            <li key={path} className="mb-2">
              <Link
                to={path}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  location.pathname === path
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}