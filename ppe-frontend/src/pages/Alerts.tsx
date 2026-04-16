import { AlertsTable } from '../components/AlertsTable';

export function Alerts() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">All Alerts</h1>
      <AlertsTable />
    </div>
  );
}