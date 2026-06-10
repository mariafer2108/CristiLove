'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit2,
  Package,
  X
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { Product } from '@/lib/types';
import { formatCurrency, cn } from '@/lib/utils';

export default function InventarioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const initialProductState: Partial<Product> = {
    name: '',
    category: 'Papelería',
    stock: 0,
    minStock: 5,
    price: 0,
    cost: 0,
  };

  const [formData, setFormData] = useState<Partial<Product>>(initialProductState);

  useEffect(() => {
    setProducts(storage.getProducts());
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
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
    
    if (editingProduct) {
      // Edit existing product
      updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...(formData as Product), lastUpdated: new Date().toISOString() }
          : p
      );
    } else {
      // Add new product
      const product: Product = {
        ...(formData as Product),
        id: Math.random().toString(36).substr(2, 9),
        lastUpdated: new Date().toISOString(),
      };
      updatedProducts = [...products, product];
    }
    
    setProducts(updatedProducts);
    storage.saveProducts(updatedProducts);
    handleCloseModal();
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Estás segura de eliminar este producto?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      storage.saveProducts(updatedProducts);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventario</h1>
          <p className="text-foreground/60 mt-1">Gestiona tus productos y niveles de stock.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o categoría..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-muted bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-muted bg-card text-foreground/70 hover:bg-muted/50 transition-colors font-medium">
          <Filter className="w-5 h-5" />
          Filtros
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-2xl border border-muted shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-20 text-center">
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-foreground/20" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No hay productos</h3>
            <p className="text-foreground/60 mt-2">Comienza agregando tu primer producto al inventario.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/50 text-left border-b border-muted">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-foreground/60 uppercase">Producto</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/60 uppercase">Categoría</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/60 uppercase">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/60 uppercase text-right">Precio Venta</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/60 uppercase text-right">Costo</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/60 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-primary font-bold">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-bold text-foreground">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-muted text-foreground/70 px-2 py-1 rounded-md text-xs font-medium">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={cn(
                        "font-bold",
                        p.stock <= p.minStock ? "text-rose-600" : "text-foreground"
                      )}>
                        {p.stock} unidades
                      </span>
                      {p.stock <= p.minStock && (
                        <span className="text-[10px] font-bold text-rose-500 uppercase">Stock Bajo</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-foreground">
                    {formatCurrency(p.price)}
                  </td>
                  <td className="px-6 py-4 text-right text-foreground/60 font-medium">
                    {formatCurrency(p.cost)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditClick(p)}
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
          <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-muted flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <p className="text-foreground/60">
                  {editingProduct ? 'Modifica la información del producto.' : 'Completa la información para agregar al inventario.'}
                </p>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-muted rounded-full transition-colors text-foreground/40">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/70 ml-1">Nombre del Producto</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  placeholder="Ej. Stickers Holográficos"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/70 ml-1">Stock</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/70 ml-1">Precio Venta</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/70 ml-1">Costo Unitario</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
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
                  {editingProduct ? 'Guardar Cambios' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
