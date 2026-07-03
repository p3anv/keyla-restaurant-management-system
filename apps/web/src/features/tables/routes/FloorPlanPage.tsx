import { useTables } from '@/hooks/queries/useTables';
import { useUpdateTable } from '@/hooks/queries/useUpdateTable';

const statusStyles = {
  FREE: {
    card: 'border-emerald-500/30 bg-emerald-500/10',
    badge: 'bg-emerald-500/20 text-emerald-300',
  },
  OCCUPIED: {
    card: 'border-red-500/30 bg-red-500/10',
    badge: 'bg-red-500/20 text-red-300',
  },
  RESERVED: {
    card: 'border-yellow-500/30 bg-yellow-500/10',
    badge: 'bg-yellow-500/20 text-yellow-300',
  },
  OUT_OF_SERVICE: {
    card: 'border-slate-500/30 bg-slate-500/10 opacity-70',
    badge: 'bg-slate-500/20 text-slate-300',
  },
};

const statusLabels = {
  FREE: 'Free',
  OCCUPIED: 'Occupied',
  RESERVED: 'Reserved',
  OUT_OF_SERVICE: 'Out of Service',
};

export const FloorPlanPage = () => {
  const { data: tables, isLoading } =
    useTables();

  const {
    mutate: updateTable,
  } = useUpdateTable();

  const handleStatusChange = (
    tableId: string,
    newStatus: string
  ) => {
    if (
      !confirm(
        `Change table status to "${newStatus}"?`
      )
    )
      return;

    updateTable({
      tableId,
      status: newStatus,
    });
  };

  if (isLoading) {
    return (
      <div className="text-slate-400">
        Loading tables...
      </div>
    );
  }

  if (
    !tables ||
    tables.length === 0
  ) {
    return (
      <div className="text-slate-400">
        No tables found.
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Floor Plan
          </h1>

          <p className="text-slate-400 mt-2">
            Manage restaurant table status
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-slate-400 text-sm">
          Click a dropdown to update status
        </div>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6">
        {tables.map((table) => {
          const style =
            statusStyles[
              table.status as keyof typeof statusStyles
            ];

          return (
            <div
              key={table.id}
              className={`
                backdrop-blur-xl
                border
                rounded-3xl
                p-5
                text-center
                transition-all
                hover:scale-105
                hover:shadow-xl
                ${style.card}
              `}
            >
              {/* Table Number */}
              <div className="text-5xl font-bold text-white">
                {table.tableNumber}
              </div>

              <div className="text-slate-400 text-sm mt-2">
                Capacity: {table.capacity}
              </div>

              {/* Status Badge */}
              <div
                className={`
                  mt-4
                  inline-block
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-semibold
                  ${style.badge}
                `}
              >
                {
                  statusLabels[
                    table.status as keyof typeof statusLabels
                  ]
                }
              </div>

              {/* Dropdown */}
              <div className="mt-5">
                <select
                  value={table.status}
                  onChange={(e) =>
                    handleStatusChange(
                      table.id,
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    bg-slate-900/80
                    border
                    border-white/10
                    rounded-xl
                    px-3
                    py-2
                    text-sm
                    text-white
                    focus:outline-none
                    focus:ring-2
                    focus:ring-cyan-500
                  "
                >
                  <option value="FREE">
                    Free
                  </option>

                  <option value="OCCUPIED">
                    Occupied
                  </option>

                  <option value="RESERVED">
                    Reserved
                  </option>

                  <option value="OUT_OF_SERVICE">
                    Out of Service
                  </option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};