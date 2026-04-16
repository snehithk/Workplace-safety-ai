import { createContext, useContext, useState, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { SafetyCopilot } from './SafetyCopilot';

interface LayoutContextType {
  openCopilot: () => void;
}

const LayoutContext = createContext<LayoutContextType | null>(null);

export function Layout({ children }: { children: ReactNode }) {
  const [copilotOpen, setCopilotOpen] = useState(false);

  const openCopilot = () => setCopilotOpen(true);

  return (
    <LayoutContext.Provider value={{ openCopilot }}>
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
        {copilotOpen && <SafetyCopilot onClose={() => setCopilotOpen(false)} />}
      </div>
    </LayoutContext.Provider>
  );
}

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayoutContext must be used within Layout');
  return context;
};