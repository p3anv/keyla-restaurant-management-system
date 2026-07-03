import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { apiClient } from '@/api/client';
import { useState } from 'react';

export const InventoryManagement = () => {
  const queryClient =
    useQueryClient();

  const [
    restockQuantities,
    setRestockQuantities,
  ] = useState<
    Record<string, number>
  >({});

  const {
    data: inventory,
    isLoading,
  } = useQuery({
    queryKey: ['inventory'],
    queryFn: () =>
      apiClient
        .get(
          '/api/v1/inventory'
        )
        .then(
          (res) =>
            res.data.data
              .inventory
        ),
  });

  const restockMutation =
    useMutation({
      mutationFn: ({
        id,
        quantity,
      }: {
        id: string;
        quantity: number;
      }) =>
        apiClient.patch(
          `/api/v1/inventory/items/${id}`,
          {
            stockQuantity:
              quantity,
          }
        ),

      onSuccess: () =>
        queryClient.invalidateQueries(
          {
            queryKey: [
              'inventory',
            ],
          }
        ),
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-400">
          Loading inventory...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

      {/* Header */}
      <div className="px-8 py-6 border-b border-white/10">
        <h2 className="text-3xl font-bold text-white">
          Inventory Management
        </h2>

        <p className="text-slate-400 mt-2">
          Monitor stock levels and update inventory quantities.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">

          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Item
              </th>

              <th className="px-8 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Current Stock
              </th>

              <th className="px-8 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </th>

              <th className="px-8 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Restock
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {inventory?.map(
              (item: any) => {
                const stockStatus =
                  item.stockQuantity <=
                  5
                    ? 'Low'
                    : item.stockQuantity <=
                        15
                    ? 'Medium'
                    : 'Healthy';

                const statusClass =
                  item.stockQuantity <=
                  5
                    ? 'bg-red-500/15 text-red-300 border-red-500/20'
                    : item.stockQuantity <=
                        15
                    ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/20'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20';

                return (
                  <tr
                    key={
                      item.id
                    }
                    className="hover:bg-white/5 transition-colors"
                  >
                    {/* Item Name */}
                    <td className="px-8 py-5">
                      <div className="font-medium text-white">
                        {
                          item.name
                        }
                      </div>
                    </td>

                    {/* Stock Quantity */}
                    <td className="px-8 py-5">
                      <div className="text-lg font-bold text-cyan-400">
                        {
                          item.stockQuantity
                        }
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-8 py-5">
                      <span
                        className={`
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-semibold
                          border
                          ${statusClass}
                        `}
                      >
                        {
                          stockStatus
                        }
                      </span>
                    </td>

                    {/* Update Controls */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">

                        <input
                          type="number"
                          min="0"
                          value={
                            restockQuantities[
                              item.id
                            ] ??
                            item.stockQuantity
                          }
                          onChange={(
                            e
                          ) =>
                            setRestockQuantities(
                              {
                                ...restockQuantities,
                                [
                                  item.id
                                ]:
                                  Number(
                                    e
                                      .target
                                      .value
                                  ),
                              }
                            )
                          }
                          className="
                            w-24
                            px-3
                            py-2
                            rounded-xl
                            bg-white/5
                            border
                            border-white/10
                            text-white
                            text-center
                            focus:outline-none
                            focus:ring-2
                            focus:ring-cyan-500
                          "
                        />

                        <button
                          onClick={() =>
                            restockMutation.mutate(
                              {
                                id: item.id,
                                quantity:
                                  restockQuantities[
                                    item.id
                                  ] ??
                                  item.stockQuantity,
                              }
                            )
                          }
                          disabled={
                            restockMutation.isPending
                          }
                          className="
                            px-4
                            py-2
                            rounded-xl
                            bg-cyan-500
                            text-slate-950
                            font-semibold
                            hover:bg-cyan-400
                            transition-all
                            disabled:opacity-50
                          "
                        >
                          Update
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};