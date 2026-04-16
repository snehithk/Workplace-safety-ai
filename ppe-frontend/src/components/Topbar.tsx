import { Bot } from 'lucide-react';
import { useLayoutContext } from './Layout';

export function Topbar() {
  const { openCopilot } = useLayoutContext();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-lg">
      <div className="text-xl font-semibold">Safety Dashboard</div>
      <button
        onClick={openCopilot}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
      >
        <Bot className="w-5 h-5" />
        <span>Safety Copilot</span>
      </button>
    </header>
  );
}