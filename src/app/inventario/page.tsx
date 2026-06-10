'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit2,
  Package,
  X,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { Product, RecipeItem } from '@/lib/types';
import { formatCurrency, cn } from '@/lib/utils';

export default function InventarioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'product' | 'material'>('all');

  const initialProductState: Partial<Product> = {
    name: '',
    type: 'product',
    category: 'Papelería',
    stock: 0,
    minStock: 5,
    price: 0,
    cost: 0,
    unit: 'unidad',
    recipe: [],
  };

  const [formData, setFormData] = useState<Partial<Product>>(initialProductState);

  useEffect(() => {
    setProducts(storage.getProducts());
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        ...editingProduct,
        recipe: editingProduct.recipe || [],
      });
      setIsModalOpen(true);
    } else {
      setFormData(initialProductState);
    }
  }, [editingProduct]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData(initialProductState);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(initialProductState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let updatedProducts: Product[];
    
    const finalProduct: Product = {
      ...(formData as Product),
      id: editingProduct?.id || Math.random().toString(36).substr(2, 9),
      lastUpdated: new Date().toISOString(),
      type: formData.type || 'product',
      recipe: formData.type === 'product' ? formData.recipe : undefined,
    };

    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? finalProduct : p);
    } else {
      updatedProducts = [...products, finalProduct];
    }
    
    setProducts(updatedProducts);
    storage.saveProducts(updatedProducts);
    handleCloseModal();
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Estás segura de eliminar este item?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      storage.saveProducts(updatedProducts);
    }
  };

  const handleAddRecipeItem = () => {
    const currentRecipe = formData.recipe || [];
    setFormData({
      ...formData,
      recipe: [...currentRecipe, { materialId: '', quantity: 1 }]
    });
  };

  const handleRemoveRecipeItem = (index: number) => {
    const currentRecipe = [...(formData.recipe || [])];
    currentRecipe.splice(index, 1);
    setFormData({ ...formData, recipe: currentRecipe });
  };

  const handleUpdateRecipeItem = (index: number, field: keyof RecipeItem, value: string | number) => {
    const currentRecipe = [...(formData.recipe || [])];
    currentRecipe[index] = { ...currentRecipe[index], [field]: value };
    setFormData({ ...formData, recipe: currentRecipe });
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  const materials = products.filter(p => p.type === 'material');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventario</h1>
          <p className="text-foreground/60 mt-1">Gestiona tus materiales y productos terminados.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Nuevo Item
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o categoría..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-muted bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex p-1 bg-muted rounded-xl">
          {(['all', 'product', 'material'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all",
                filterType === type 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-foreground/40 hover:text-foreground/60"
              )}
            >
              {type === 'all' ? 'Todos' : type === 'product' ? 'Productos' : 'Materiales'}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-2xl border border-muted shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-20 text-center">
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-foreground/20" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No hay items</h3>
            <p className="text-foreground/60 mt-2">Comienza agregando materiales o productos.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/50 text-left border-b border-muted">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-foreground/60 uppercase">Nombre</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/60 uppercase">Tipo</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/60 uppercase">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/60 uppercase text-right">Precio/Costo</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/60 uppercase">Receta</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/60 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white",
                        p.type === 'product' ? "bg-primary" : "bg-accent"
                      )}>
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-foreground block">{p.name}</span>
                        <span className="text-[10px] text-foreground/40 uppercase font-bold tracking-wider">{p.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border",
                      p.type === 'product' 
                        ? "bg-primary/10 text-primary border-primary/20" 
                        : "bg-accent/10 text-accent-foreground border-accent/20"
                    )}>
                      {p.type === 'product' ? 'Producto' : 'Material'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={cn(
                        "font-bold",
                        p.stock <= p.minStock ? "text-rose-600" : "text-foreground"
                      )}>
                        {p.stock} {p.unit || 'uds'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">
                        {p.type === 'product' ? formatCurrency(p.price) : formatCurrency(p.cost)}
                      </span>
                      <span className="text-[10px] text-foreground/40 font-bold uppercase">
                        {p.type === 'product' ? 'Venta' : 'Costo Unit.'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {p.type === 'product' && p.recipe && p.recipe.length > 0 ? (
                      <div className="flex items-center gap-1 text-primary">
                        <Layers className="w-4 h-4" />
                        <span className="text-xs font-bold">{p.recipe.length} materiales</span>
                      </div>
                    ) : p.type === 'product' ? (
                      <span className="text-xs text-foreground/30 font-medium italic">Sin receta</span>
                    ) : (
                      <span className="text-xs text-foreground/20">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingProduct(p)}
                        className="p-2 hover:bg-muted rounded-lg text-foreground/60 hover:text-primary transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 hover:bg-rose-50 rounded-lg text-foreground/60 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-muted flex justify-between items-center bg-card shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {editingProduct ? 'Editar Item' : 'Nuevo Item'}
                </h2>
                <p className="text-foreground/60">
                  Define si es un material o un producto final con receta.
                </p>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-muted rounded-full transition-colors text-foreground/40">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
              {/* Tipo de Item */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/70 ml-1">¿Qué estás agregando?</label>
                <div className="flex p-1 bg-muted rounded-2xl w-full">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'material', recipe: undefined})}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-bold text-sm transition-all",
                      formData.type === 'material' 
                        ? "bg-white text-accent-foreground shadow-sm" 
                        : "text-foreground/40 hover:text-foreground/60"
                    )}
                  >
                    Material (Materia Prima)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'product'})}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-bold text-sm transition-all",
                      formData.type === 'product' 
                        ? "bg-white text-primary shadow-sm" 
                        : "text-foreground/40 hover:text-foreground/60"
                    )}
                  >
                    Producto (Hecho con materiales)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/70 ml-1">Nombre</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    placeholder="Ej. Papel Fotográfico"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/70 ml-1">Categoría</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Papelería">Papelería</option>
                    <option value="Manualidades">Manualidades</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Herramientas">Herramientas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/70 ml-1">Stock Actual</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/70 ml-1">Stock Mínimo</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    value={formData.minStock}
                    onChange={(e) => setFormData({...formData, minStock: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/70 ml-1">Unidad</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    placeholder="Ej. hojas, mts, uds"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/70 ml-1">
                    {formData.type === 'product' ? 'Precio de Venta' : 'Costo de Compra'}
                  </label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    value={formData.type === 'product' ? formData.price : formData.cost}
                    onChange={(e) => setFormData({
                      ...formData, 
                      [formData.type === 'product' ? 'price' : 'cost']: parseFloat(e.target.value)
                    })}
                  />
                </div>
              </div>

              {/* Sección de Receta (Solo para Productos) */}
              {formData.type === 'product' && (
                <div className="space-y-4 pt-4 border-t border-muted">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Layers className="w-5 h-5 text-primary" />
                      Receta del Producto
                    </h3>
                    <button 
                      type="button"
                      onClick={handleAddRecipeItem}
                      className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      + Agregar Material
                    </button>
                  </div>
                  
                  {(!formData.recipe || formData.recipe.length === 0) ? (
                    <p className="text-sm text-foreground/40 italic text-center py-4 bg-muted/20 rounded-xl border border-dashed border-muted">
                      No has agregado materiales a este producto.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {formData.recipe.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 bg-muted/20 p-3 rounded-xl border border-muted">
                          <select 
                            required
                            className="flex-1 px-3 py-2 rounded-lg border border-muted bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                            value={item.materialId}
                            onChange={(e) => handleUpdateRecipeItem(index, 'materialId', e.target.value)}
                          >
                            <option value="">Selecciona un material...</option>
                            {materials.map(m => (
                              <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>
                            ))}
                          </select>
                          <div className="flex items-center gap-2 w-32">
                            <input 
                              required
                              type="number"
                              placeholder="Cant."
                              className="w-full px-3 py-2 rounded-lg border border-muted bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                              value={item.quantity}
                              onChange={(e) => handleUpdateRecipeItem(index, 'quantity', parseFloat(e.target.value))}
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleRemoveRecipeItem(index)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4 pt-4 shrink-0 bg-card">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 rounded-xl border border-muted font-bold text-foreground/60 hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Guardar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
