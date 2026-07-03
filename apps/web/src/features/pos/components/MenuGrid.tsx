import { useMenu } from '@/hooks/queries/useMenu';
import {
  MenuItem,
  ModifierGroup,
  ModifierOption,
} from '@/api/endpoints/menu.api';

import { useCartStore } from '@/stores/cart.store';
import { useState } from 'react';

interface MenuGridProps {
  onAddItem: (
    item: MenuItem,
    modifiers: ModifierOption[]
  ) => void;
}

export const MenuGrid = ({
  onAddItem,
}: MenuGridProps) => {
  const {
    data: categories,
    isLoading,
    error,
  } = useMenu();

  if (isLoading) {
    return (
      <div className="text-center py-16 text-slate-400">
        Loading menu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-400">
        Failed to load menu
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        No menu items found.
        <br />
        Please add items from the admin panel.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {categories.map((category) => (
        <div key={category.id}>
          <h2 className="text-3xl font-bold text-white mb-6">
            {category.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {category.items.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddItem={onAddItem}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const MenuItemCard = ({
  item,
  onAddItem,
}: {
  item: MenuItem;
  onAddItem: (
    item: MenuItem,
    modifiers: ModifierOption[]
  ) => void;
}) => {
  const [showModifiers, setShowModifiers] =
    useState(false);

  const [selectedModifiers, setSelectedModifiers] =
    useState<ModifierOption[]>([]);

  const itemsInCart = useCartStore(
    (state) => state.items
  );

  const quantityInCart =
    itemsInCart.find(
      (i) => i.menuItemId === item.id
    )?.quantity || 0;

  const handleAdd = () => {
    if (item.modifiers.length > 0) {
      setShowModifiers(true);
    } else {
      onAddItem(item, []);
    }
  };

  const handleConfirmModifiers = () => {
    onAddItem(item, selectedModifiers);

    setShowModifiers(false);
    setSelectedModifiers([]);
  };

  const toggleModifier = (
    option: ModifierOption,
    group: ModifierGroup
  ) => {
    const existing = selectedModifiers.find(
      (o) => o.id === option.id
    );

    if (existing) {
      setSelectedModifiers(
        selectedModifiers.filter(
          (o) => o.id !== option.id
        )
      );
    } else {
      const groupSelections =
        selectedModifiers.filter((o) =>
          item.modifiers.find((g) =>
            g.options.some(
              (opt) => opt.id === o.id
            )
          )
        );

      const groupOptions =
        item.modifiers.find(
          (g) => g.id === group.id
        );

      if (
        groupOptions &&
        groupSelections.length >=
          groupOptions.maxSelect
      ) {
        alert(
          `Maximum ${groupOptions.maxSelect} selections allowed for ${group.name}`
        );

        return;
      }

      setSelectedModifiers([
        ...selectedModifiers,
        option,
      ]);
    }
  };

  const itemPrice =
    item.price +
    selectedModifiers.reduce(
      (sum, opt) =>
        sum + opt.priceAdjustment,
      0
    );

  return (
    <>
      <div
        className={`
          bg-slate-900/70
          backdrop-blur-xl
          border
          rounded-3xl
          p-5
          transition-all
          hover:scale-[1.02]
          hover:shadow-2xl
          hover:shadow-cyan-500/10
          ${
            item.stockQuantity <= 0
              ? 'border-red-500/20 opacity-50'
              : 'border-white/10 hover:border-cyan-400/30'
          }
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white">
              {item.name}
            </h3>

            <p className="text-sm text-slate-400 mt-2 line-clamp-2">
              {item.description || ''}
            </p>

            <div className="mt-5 flex justify-between items-center">
              <span className="text-2xl font-bold text-cyan-400">
                ${item.price.toFixed(2)}
              </span>

              {quantityInCart > 0 && (
                <span className="text-xs bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 px-3 py-1 rounded-full">
                  {quantityInCart} in cart
                </span>
              )}
            </div>

            {item.stockQuantity <= 0 && (
              <div className="mt-3">
                <span className="text-xs bg-red-500/10 text-red-300 border border-red-500/20 px-3 py-1 rounded-full">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={item.stockQuantity <= 0}
            className="
              mt-5
              w-full
              py-3
              rounded-xl
              bg-cyan-500
              text-slate-950
              font-bold
              hover:bg-cyan-400
              transition-all
              shadow-lg
              shadow-cyan-500/20
              disabled:bg-slate-700
              disabled:text-slate-500
              disabled:cursor-not-allowed
            "
          >
            Add to Order
          </button>
        </div>
      </div>

      {showModifiers && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white">
              {item.name}
            </h3>

            <p className="text-slate-400 mt-1 mb-6">
              Customize your order
            </p>

            <div className="space-y-6">
              {item.modifiers.map((group) => (
                <div key={group.id}>
                  <div className="flex justify-between mb-3">
                    <h4 className="text-white font-medium">
                      {group.name}
                    </h4>

                    <span className="text-xs text-slate-500">
                      Min {group.minSelect} · Max{' '}
                      {group.maxSelect}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {group.options.map(
                      (option) => {
                        const selected =
                          selectedModifiers.some(
                            (o) =>
                              o.id === option.id
                          );

                        return (
                          <button
                            key={option.id}
                            onClick={() =>
                              toggleModifier(
                                option,
                                group
                              )
                            }
                            className={`
                              w-full
                              px-4
                              py-3
                              rounded-xl
                              border
                              flex
                              justify-between
                              items-center
                              transition-all
                              ${
                                selected
                                  ? `
                                  bg-cyan-500/15
                                  border-cyan-400/30
                                  text-cyan-300
                                `
                                  : `
                                  bg-white/5
                                  border-white/10
                                  text-slate-300
                                  hover:bg-white/10
                                `
                              }
                            `}
                          >
                            <span>
                              {option.name}
                            </span>

                            <span>
                              {option.priceAdjustment >
                              0
                                ? '+'
                                : ''}
                              $
                              {option.priceAdjustment.toFixed(
                                2
                              )}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() =>
                  setShowModifiers(false)
                }
                className="
                  flex-1
                  py-3
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  text-slate-300
                  hover:bg-white/10
                "
              >
                Cancel
              </button>

              <button
                onClick={
                  handleConfirmModifiers
                }
                className="
                  flex-1
                  py-3
                  rounded-xl
                  bg-cyan-500
                  text-slate-950
                  font-bold
                  hover:bg-cyan-400
                  shadow-lg
                  shadow-cyan-500/20
                "
              >
                Add (${itemPrice.toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};