import { useMenu } from '@/hooks/queries/useMenu';
import { useCartStore } from '@/stores/cart.store';
import { MenuItem, ModifierGroup, ModifierOption } from '@/api/endpoints/menu.api';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface MenuGridProps {
  onAddItem: (item: MenuItem, modifiers: ModifierOption[]) => void;
}

export const MenuGrid = ({ onAddItem }: MenuGridProps) => {
  const { data: categories, isLoading, error } = useMenu();

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading menu...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Failed to load menu</div>;
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No menu items found. Please add items in the admin panel.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category.id}>
          <h2 className="text-xl font-bold text-gray-800 mb-4">{category.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.items.map((item) => (
              <MenuItemCard key={item.id} item={item} onAddItem={onAddItem} />
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
  onAddItem: (item: MenuItem, modifiers: ModifierOption[]) => void;
}) => {
  const [showModifiers, setShowModifiers] = useState(false);
  const [selectedModifiers, setSelectedModifiers] = useState<ModifierOption[]>([]);
  const itemsInCart = useCartStore((state) => state.items);
  const quantityInCart = itemsInCart.find((i) => i.menuItemId === item.id)?.quantity || 0;

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

  const toggleModifier = (option: ModifierOption, group: ModifierGroup) => {
    const existing = selectedModifiers.find((o) => o.id === option.id);
    if (existing) {
      setSelectedModifiers(selectedModifiers.filter((o) => o.id !== option.id));
    } else {
      // Check maxSelect
      const groupSelections = selectedModifiers.filter((o) =>
        item.modifiers.find((g) => g.options.some((opt) => opt.id === o.id))
      );
      const groupOptions = item.modifiers.find((g) => g.id === group.id);
      if (groupOptions && groupSelections.length >= groupOptions.maxSelect) {
        alert(`You can select a maximum of ${groupOptions.maxSelect} options for ${group.name}`);
        return;
      }
      setSelectedModifiers([...selectedModifiers, option]);
    }
  };

  const itemPrice = item.price + selectedModifiers.reduce((sum, opt) => sum + opt.priceAdjustment, 0);

  return (
    <>
      <div
        className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border ${
          item.stockQuantity <= 0 ? 'border-red-200 opacity-60' : 'border-gray-200'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{item.name}</h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description || ''}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-lg font-bold text-primary-600">${item.price.toFixed(2)}</span>
              {quantityInCart > 0 && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                  {quantityInCart} in cart
                </span>
              )}
            </div>
            {item.stockQuantity <= 0 && (
              <span className="text-xs text-red-500 font-medium mt-1 block">Sold Out</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={item.stockQuantity <= 0}
            className="mt-3 w-full bg-primary-600 text-white py-1.5 rounded-md hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
          >
            Add to Order
          </button>
        </div>
      </div>

      {/* Modifier Modal */}
      {showModifiers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
            <p className="text-sm text-gray-600 mb-4">Customize your order</p>
            <div className="space-y-4">
              {item.modifiers.map((group) => (
                <div key={group.id}>
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-700">{group.name}</h4>
                    <span className="text-xs text-gray-500">
                      {group.minSelect > 0 && `Min ${group.minSelect}`}
                      {group.maxSelect > 0 && ` Max ${group.maxSelect}`}
                    </span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {group.options.map((option) => {
                      const isSelected = selectedModifiers.some((o) => o.id === option.id);
                      return (
                        <button
                          key={option.id}
                          onClick={() => toggleModifier(option, group)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm flex justify-between items-center transition-colors ${
                            isSelected
                              ? 'bg-primary-100 border border-primary-300'
                              : 'hover:bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <span>{option.name}</span>
                          {option.priceAdjustment !== 0 && (
                            <span className="text-xs text-gray-500">
                              {option.priceAdjustment > 0 ? '+' : ''}
                              ${option.priceAdjustment.toFixed(2)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModifiers(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmModifiers}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Add to Order (${itemPrice.toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};