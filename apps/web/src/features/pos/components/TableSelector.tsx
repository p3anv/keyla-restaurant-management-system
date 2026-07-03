import { useTables } from '@/hooks/queries/useTables';
import { useCartStore } from '@/stores/cart.store';

export const TableSelector = () => {
  const { data: tables, isLoading } = useTables();
  const { tableId, setTable } = useCartStore();

  if (isLoading) {
    return <div className="text-gray-500 text-sm">Loading tables...</div>;
  }

  const freeTables = tables?.filter((t) => t.status === 'FREE') || [];

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700">Table:</label>
      <select
        value={tableId || ''}
        onChange={(e) => setTable(e.target.value || null)}
        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500"
      >
        <option value="">Select Table</option>
        {freeTables.map((table) => (
          <option key={table.id} value={table.id}>
            Table {table.tableNumber} (Capacity: {table.capacity})
          </option>
        ))}
      </select>
    </div>
  );
};