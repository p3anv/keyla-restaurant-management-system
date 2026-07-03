import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi } from '@/api/endpoints/menu.api';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

export const MenuManagement = () => {
  const queryClient = useQueryClient();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [showItemForm, setShowItemForm] = useState<{ categoryId?: string; item?: any } | null>(null);
  const [showModifierForm, setShowModifierForm] = useState<{ itemId: string } | null>(null);

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['menu'],
    queryFn: () => menuApi.getMenu().then((res) => res.data.categories),
  });

  const toggleCategory = (id: string) => {
    const newSet = new Set(expandedCategories);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedCategories(newSet);
  };

  // --- Category Mutations ---
  const createCategory = useMutation({
    mutationFn: menuApi.createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menu'] }),
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, ...data }: any) => menuApi.updateCategory(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menu'] }),
  });

  const deleteCategory = useMutation({
    mutationFn: menuApi.deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menu'] }),
  });

  // --- Item Mutations ---
  const createItem = useMutation({
    mutationFn: menuApi.createItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menu'] }),
  });

  const updateItem = useMutation({
    mutationFn: ({ id, ...data }: any) => menuApi.updateItem(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menu'] }),
  });

  const deleteItem = useMutation({
    mutationFn: menuApi.deleteItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menu'] }),
  });

  if (isLoading) return <div className="text-gray-500">Loading menu...</div>;
  if (error) return <div className="text-red-500">Failed to load menu</div>;

  return (
    <div className="space-y-8">
      {/* Add Category Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Categories & Items</h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowCategoryForm(true);
          }}
          className="
            px-5 py-3
            bg-cyan-500
            text-slate-950
            rounded-2xl
            hover:bg-cyan-400
            font-semibold
            flex items-center gap-2
            transition-all
            shadow-lg
            shadow-cyan-500/20
          "
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Category List */}
      {categories?.map((category: any) => (
        <div
          key={category.id}
          className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
        >
          {/* Category Header */}
          <div className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 cursor-pointer">
            <div className="flex items-center gap-2" onClick={() => toggleCategory(category.id)}>
              {expandedCategories.has(category.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              <span className="font-semibold text-white">{category.name}</span>
              <span className="text-sm text-slate-400">({category.items.length} items)</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setEditingCategory(category); setShowCategoryForm(true); }}
                className="p-1 text-slate-400 hover:text-cyan-400"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); if (confirm(`Delete category "${category.name}"?`)) deleteCategory.mutate(category.id); }}
                className="p-1 text-slate-400 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setShowItemForm({ categoryId: category.id }); }}
                className="px-3 py-1 bg-cyan-500 text-slate-950 text-xs rounded-xl hover:bg-cyan-400 font-semibold"
              >
                Add Item
              </button>
            </div>
          </div>

          {/* Items List (expandable) */}
          {expandedCategories.has(category.id) && (
            <div className="p-4 bg-slate-950/40 border-t border-white/10">
              {category.items.length === 0 ? (
                <p className="text-gray-400 text-sm">No items in this category.</p>
              ) : (
                <table className="min-w-full divide-y divide-white/10">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase">Price</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase">Stock</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase">Course</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {category.items.map((item: any) => (
                      <tr key={item.id}>
                        <td className="px-3 py-2 text-sm text-white">{item.name}</td>
                        <td className="px-3 py-2 text-sm text-slate-300">${item.price.toFixed(2)}</td>
                        <td className="px-3 py-2 text-sm text-slate-300">{item.stockQuantity}</td>
                        <td className="px-3 py-2 text-sm text-slate-300">{item.course}</td>
                        <td className="px-3 py-2 text-sm flex gap-2">
                          <button
                            onClick={() => setShowItemForm({ categoryId: category.id, item })}
                            className="text-cyan-400 hover:text-cyan-300"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete item "${item.name}"?`)) deleteItem.mutate(item.id);
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button
                            onClick={() => setShowModifierForm({ itemId: item.id })}
                            className="text-slate-400 hover:text-white text-xs"
                          >
                            Modifiers
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Modal: Category Form */}
      {showCategoryForm && (
        <CategoryForm
          initialData={editingCategory}
          onSave={(data) => {
            if (editingCategory) {
              updateCategory.mutate({ id: editingCategory.id, ...data });
            } else {
              createCategory.mutate(data);
            }
            setShowCategoryForm(false);
          }}
          onCancel={() => setShowCategoryForm(false)}
        />
      )}

      {/* Modal: Item Form */}
      {showItemForm && (
        <ItemForm
          categoryId={showItemForm.categoryId}
          initialData={showItemForm.item}
          onSave={(data) => {
            if (showItemForm.item) {
              updateItem.mutate({ id: showItemForm.item.id, ...data });
            } else {
              createItem.mutate(data);
            }
            setShowItemForm(null);
          }}
          onCancel={() => setShowItemForm(null)}
        />
      )}

      {/* Modal: Modifier Form */}
      {showModifierForm && (
        <ModifierForm
          itemId={showModifierForm.itemId}
          onClose={() => setShowModifierForm(null)}
        />
      )}
    </div>
  );
};

// --- Sub-components ---
const CategoryForm = ({ initialData, onSave, onCancel }: any) => {
  const [name, setName] = useState(initialData?.name || '');
  const [displayOrder, setDisplayOrder] = useState(initialData?.displayOrder || 0);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 max-w-md w-full">
        <h3 className="text-lg font-bold text-white mb-4">{initialData ? 'Edit Category' : 'Add Category'}</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400"
          />
          <input
            type="number"
            placeholder="Display Order"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400"
          />
          <div className="flex gap-3 justify-end">
            <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
            <button
              onClick={() => onSave({ name, displayOrder })}
              className="px-4 py-2 bg-cyan-500 text-slate-950 font-semibold rounded-xl hover:bg-cyan-400"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ItemForm = ({ categoryId, initialData, onSave, onCancel }: any) => {
  const [name, setName] = useState(initialData?.name || '');
  const [price, setPrice] = useState(initialData?.price || 0);
  const [description, setDescription] = useState(initialData?.description || '');
  const [stock, setStock] = useState(initialData?.stockQuantity || 0);
  const [course, setCourse] = useState(initialData?.course || 'MAIN');
  const [taxCategory, setTaxCategory] = useState(initialData?.taxCategory || 'FOOD');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-white mb-4">{initialData ? 'Edit Item' : 'Add Item'}</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400"
            rows={2}
          />
          <input
            type="number"
            placeholder="Stock Quantity"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400"
          />
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
          >
            <option value="STARTER">Starter</option>
            <option value="MAIN">Main</option>
            <option value="DESSERT">Dessert</option>
            <option value="BEVERAGE">Beverage</option>
          </select>
          <select
            value={taxCategory}
            onChange={(e) => setTaxCategory(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
          >
            <option value="FOOD">Food (5%)</option>
            <option value="BEVERAGE">Beverage (18%)</option>
            <option value="ALCOHOL">Alcohol (25%)</option>
          </select>
          <div className="flex gap-3 justify-end">
            <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
            <button
              onClick={() => onSave({ name, price, description, stockQuantity: stock, course, taxCategory, categoryId })}
              className="px-4 py-2 bg-cyan-500 text-slate-950 font-semibold rounded-xl hover:bg-cyan-400"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModifierForm = ({ itemId, onClose }: any) => {
  // Implementation similar to above – manage groups and options
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 max-w-md w-full">
        <h3 className="text-lg font-bold text-white mb-4">Manage Modifiers</h3>
        <p className="text-sm text-gray-500">Modifier management coming soon – you can extend this.</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20">
          Close
        </button>
      </div>
    </div>
  );
};