'use client';

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  AlertTriangle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { Product, Transaction } from '@/lib/types';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const apiProducts = await storage.loadProducts();
      const apiTransactions = await storage.loadTransactions();
      
      if (apiProducts.length > 0) {
        setProducts(apiProducts);
      } else {
        setProducts(storage.getProducts());
      }
      
      if (apiTransactions.length > 0) {
        setTransactions(apiTransactions);
      } else {
        setTransactions(storage.getTransactions());
      }
    };
    loadData();
  }, []);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  const stats = [
    {
      label: 'Ingresos Totales',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Gastos Totales',
      value: formatCurrency(totalExpense),
      icon: TrendingDown,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      label: 'Balance Neto',
      value: formatCurrency(balance),
      icon: balance >= 0 ? TrendingUp : TrendingDown,
      color: balance >= 0 ? 'text-primary' : 'text-rose-600',
      bg: balance >= 0 ? 'bg-primary/10' : 'bg-rose-50',
    },
    {
      label: 'Stock Bajo',
      value: lowStockProducts.length.toString(),
      icon: AlertTriangle,
      color: 'text-orange',
      bg: 'bg-orange/10',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border-4 border-white">
            <Image 
              src="/logo.png" 
              alt="CristiLove" 
              fill 
              sizes="(max-width: 640px) 64px, 80px"
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">¡Hola, Cristi! 👋</h1>
            <p className="text-foreground/60 text-sm sm:text-lg mt-1 font-medium">Tu papelería creativa hoy está llena de color y amor.</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-muted shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className={cn("p-2 rounded-lg sm:rounded-xl", stat.bg)}>
                  <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", stat.color)} />
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-foreground/60">{stat.label}</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-card rounded-xl lg:rounded-2xl border border-muted shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-muted flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">Transacciones Recientes</h2>
            <Link href="/finanzas" className="text-primary text-xs sm:text-sm font-semibold flex items-center gap-1 hover:underline">
              Ver todas <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
          <div className="p-0">
            {transactions.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <div className="bg-muted w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-foreground/30" />
                </div>
                <p className="text-foreground/60 text-sm sm:text-base">No hay transacciones registradas aún.</p>
              </div>
            ) : (
              <div className="divide-y divide-muted">
                {transactions.slice(0, 5).map((t) => (
                  <div key={t.id} className="p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="text-xs text-foreground/70 font-medium">
                        {new Date(t.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{t.description}</p>
                        <p className="text-xs text-foreground/60 mt-0.5">
                          <span className="bg-secondary/10 text-primary px-2 py-0.5 rounded-md font-medium border border-primary/10">
                            {t.category}
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className={cn(
                      "text-sm font-bold",
                      t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    )}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-card rounded-xl lg:rounded-2xl border border-muted shadow-sm flex flex-col">
          <div className="p-4 sm:p-6 border-b border-muted">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">Alertas de Stock</h2>
          </div>
          <div className="flex-1 p-4 sm:p-6">
            {lowStockProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-4">
                <div className="bg-emerald-50 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                </div>
                <p className="text-foreground/60 text-sm sm:text-base">¡Todo está al día! Tu inventario está bien surtido.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                    <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{p.name}</p>
                      <p className="text-xs text-amber-700 font-medium">{p.stock} {p.unit || 'unidades'} restantes</p>
                    </div>
                    <Link href="/inventario" className="text-xs font-bold text-primary hover:underline shrink-0">
                      Reponer
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}