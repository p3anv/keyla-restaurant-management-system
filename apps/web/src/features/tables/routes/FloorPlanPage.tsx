import { useTables } from '@/hooks/queries/useTables';
import { useUpdateTable } from '@/hooks/queries/useUpdateTable';

// Map status to Tailwind colors
const statusStyles = {
  FREE: 'border-green-400 bg-green-50',
  OCCUPIED: 'border-red-400 bg-red-50',
  RESERVED: 'border-yellow-400 bg-yellow-50',
  OUT_OF_SERVICE: 'border-gray-400 bg-gray-200 opacity-60',
};

const statusLabels = {
  FREE: 'Free',
  OCCUPIED: 'Occupied',
  RESERVED: 'Reserved',
  OUT_OF_SERVICE: 'Out of Service',
};

export const FloorPlanPage = () => {
  const { data: tables, isLoading } = useTables();
  const { mutate: updateTable } = useUpdateTable();

  const handleStatusChange = (tableId: string, newStatus: string) => {
    if (!confirm(`Change Table to "${newStatus}"?`)) return;
    updateTable({ tableId, status: newStatus });
  };

  if (isLoading) {
    return <div className="text-gray-500">Loading tables...</div>;
  }

  if (!tables || tables.length === 0) {
    return <div className="text-gray-500">No tables found. Please add some.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Floor Plan</h1>
        <span className="text-sm text-gray-500">Click dropdown to change table status</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`p-4 rounded-lg border-2 text-center transition-colors relative ${
              statusStyles[table.status as keyof typeof statusStyles] || 'border-gray-300 bg-gray-100'
            }`}
          >
            <div className="text-2xl font-bold text-gray-800">{table.tableNumber}</div>
            <div className="text-xs text-gray-500">Capacity: {table.capacity}</div>
            
            {/* Manual Status Dropdown */}
            <div className="mt-3">
              <select
                value={table.status}
                onChange={(e) => handleStatusChange(table.id, e.target.value)}
                className="w-full text-xs px-2 py-1 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="FREE">Free</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="RESERVED">Reserved</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>
            
            {/* Current status badge */}
            <div className="mt-2 text-xs font-medium">
              {statusLabels[table.status as keyof typeof statusLabels] || table.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};