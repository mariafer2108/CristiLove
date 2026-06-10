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
    setProducts(storage.getProducts());
    setTransactions(storage.getTransactions());
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
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
          <Image 
            src="/logo.png" 
            alt="CristiLove" 
            fill 
            sizes="96px"
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">¡Hola, Cristi! 👋</h1>
          <p className="text-foreground/60 text-lg mt-1 font-medium">Tu papelería creativa hoy está llena de color y amor.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card p-6 rounded-2xl border border-muted shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-xl", stat.bg)}>
                  <Icon className={cn("w-6 h-6", stat.color)} />
                </div>
              </div>
              <p className="text-sm font-medium text-foreground/60">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-muted shadow-sm overflow-hidden">
          <div className="p-6 border-b border-muted flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Transacciones Recientes</h2>
            <Link href="/finanzas" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-0">
            {transactions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-foreground/30" />
                </div>
                <p className="text-foreground/60">No hay transacciones registradas aún.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-foreground/60 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-xs font-bold text-foreground/60 uppercase">Descripción</th>
                    <th className="px-6 py-3 text-xs font-bold text-foreground/60 uppercase">Categoría</th>
                    <th className="px-6 py-3 text-xs font-bold text-foreground/60 uppercase text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted">
                  {transactions.slice(0, 5).map((t) => (
                    <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-foreground/70">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{t.description}</td>
                      <td className="px-6 py-4 text-sm text-foreground/70">
                        <span className="bg-secondary/10 text-primary px-2 py-1 rounded-md text-xs font-medium border border-primary/10">
                          {t.category}
                        </span>
                      </td>
                      <td className={cn(
                        "px-6 py-4 text-sm font-bold text-right",
                        t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      )}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-card rounded-2xl border border-muted shadow-sm flex flex-col">
          <div className="p-6 border-b border-muted">
            <h2 className="text-xl font-bold text-foreground">Alertas de Stock</h2>
          </div>
          <div className="flex-1 p-6">
            {lowStockProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-foreground/60">¡Todo está al día! Tu inventario está bien surtido.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{p.name}</p>
                      <p className="text-xs text-amber-700 font-medium">{p.stock} unidades restantes</p>
                    </div>
                    <Link href="/inventario" className="text-xs font-bold text-primary hover:underline">
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
