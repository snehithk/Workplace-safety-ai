import { X } from 'lucide-react';

interface SafetyCopilotProps {
  onClose: () => void;
}

export function SafetyCopilot({ onClose }: SafetyCopilotProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const query = formData.get('query') as string;
    console.log('SafetyCopilot query:', query);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-full md:w-96 bg-gray-900 h-screen p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Safety Copilot</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <textarea
            name="query"
            placeholder="Ask about safety issues, alerts, or analytics..."
            className="flex-1 bg-gray-800 text-white p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={10}
          />
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}