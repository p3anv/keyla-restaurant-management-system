import { useTables } from '@/hooks/queries/useTables';
import { useCartStore } from '@/stores/cart.store';

export const TableSelector = () => {
  const { data: tables, isLoading } = useTables();
  const { tableId, setTable } = useCartStore();

  if (isLoading) {
    return (
      <div className="text-slate-400 text-sm">
        Loading tables...
      </div>
    );
  }

  const freeTables =
    tables?.filter(
      (t) => t.status === 'FREE'
    ) || [];

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-slate-300">
        Table
      </label>

      <select
        value={tableId || ''}
        onChange={(e) =>
          setTable(
            e.target.value || null
          )
        }
        className="
          bg-slate-900/80
          backdrop-blur-xl
          border
          border-white/10
          rounded-xl
          px-4
          py-2.5
          text-white
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-cyan-500
          focus:border-cyan-500
          transition-all
          min-w-[220px]
        "
      >
        <option
          value=""
          className="bg-slate-900"
        >
          Select Table
        </option>

        {freeTables.map(
          (table) => (
            <option
              key={table.id}
              value={table.id}
              className="bg-slate-900"
            >
              Table{' '}
              {
                table.tableNumber
              }{' '}
              • {table.capacity}{' '}
              Seats
            </option>
          )
        )}
      </select>

      {tableId && (
        <div
          className="
            px-3
            py-2
            rounded-xl
            bg-emerald-500/15
            border
            border-emerald-500/20
            text-emerald-300
            text-sm
            font-medium
          "
        >
          Table Selected
        </div>
      )}
    </div>
  );
};