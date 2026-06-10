'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2,
  Package,
  Layers
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { Product, Transaction } from '@/lib/types';
import { formatCurrency, cn } from '@/lib/utils';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function VentasPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Only show "products" for sale, not materials directly
    const allItems = storage.getProducts();
    setProducts(allItems.filter(item => item.type === 'product'));
  }, []);

  const addToCart = (product: Product) => {
    // For made-to-order products, we might not check product stock but material stock
    // For now, let's allow adding and we'll check availability at checkout or show a warning
    
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const allItems = storage.getProducts();
    let updatedItems = [...allItems];
    let possible = true;
    let missingInfo = "";

    // Check and deduct materials for each product in cart
    for (const cartItem of cart) {
      const product = cartItem.product;
      const quantitySold = cartItem.quantity;

      // 1. Deduct from product stock (if any)
      updatedItems = updatedItems.map(item => {
        if (item.id === product.id) {
          return { ...item, stock: Math.max(0, item.stock - quantitySold) };
        }
        return item;
      });

      // 2. Deduct from material stock based on recipe
      if (product.recipe && product.recipe.length > 0) {
        for (const recipeItem of product.recipe) {
          const totalNeeded = recipeItem.quantity * quantitySold;
          const material = updatedItems.find(m => m.id === recipeItem.materialId);
          
          if (material) {
            if (material.stock < totalNeeded) {
              possible = false;
              missingInfo = `No hay suficiente ${material.name}. Necesitas ${totalNeeded} y tienes ${material.stock}.`;
              break;
            }
            
            updatedItems = updatedItems.map(item => {
              if (item.id === recipeItem.materialId) {
                return { ...item, stock: item.stock - totalNeeded };
              }
              return item;
            });
          }
        }
      }
      if (!possible) break;
    }

    if (!possible) {
      alert(missingInfo);
      return;
    }

    // Create transaction
    const transactions = storage.getTransactions();
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'income',
      amount: cartTotal,
      category: 'Venta',
      description: `Venta: ${cart.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}`,
      date: new Date().toISOString(),
    };

    storage.saveProducts(updatedItems);
    storage.saveTransactions([newTransaction, ...transactions]);
    
    setProducts(updatedItems.filter(i => i.type === 'product'));
    setCart([]);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nueva Venta</h1>
          <p className="text-foreground/60 mt-1">Registra una venta y descuenta materiales automáticamente.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-2xl border border-muted shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6">Productos</h2>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                <p className="text-foreground/60">No hay productos creados. Ve a Inventario para agregar uno.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p)}
                    className="flex items-center justify-between p-4 rounded-xl border border-muted text-left transition-all group bg-card hover:border-primary hover:bg-primary/5"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-foreground/50">{p.category}</span>
                        {p.recipe && p.recipe.length > 0 && (
                          <div className="flex items-center gap-0.5 text-[10px] font-bold text-primary uppercase bg-primary/10 px-1.5 rounded">
                            <Layers className="w-3 h-3" />
                            Receta
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-bold text-primary mt-1">{formatCurrency(p.price)}</p>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Plus className="w-5 h-5" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart / Summary */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-muted shadow-sm overflow-hidden flex flex-col h-[calc(100vh-250px)]">
            <div className="p-6 border-b border-muted flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Carrito de Venta</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-foreground/40">
                  <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
                  <p>El carrito está vacío</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-muted/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{item.product.name}</p>
                      <p className="text-xs font-bold text-primary">{formatCurrency(item.product.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="p-1 rounded-md hover:bg-muted text-foreground/50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="p-1 rounded-md hover:bg-muted text-foreground/50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 bg-muted/30 border-t border-muted space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-foreground/60">Total</span>
                <span className="text-primary text-2xl">{formatCurrency(cartTotal)}</span>
              </div>
              
              {isSuccess ? (
                <div className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-4 rounded-xl font-bold animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle2 className="w-6 h-6" />
                  ¡Venta Exitosa!
                </div>
              ) : (
                <button 
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                  className={cn(
                    "w-full py-4 rounded-xl font-bold transition-all shadow-lg",
                    cart.length > 0 
                      ? "bg-primary text-white hover:bg-primary/90 shadow-primary/20" 
                      : "bg-muted text-foreground/30 cursor-not-allowed"
                  )}
                >
                  Finalizar Venta
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
