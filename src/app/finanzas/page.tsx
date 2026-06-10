'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  Filter,
  Trash2
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { Transaction } from '@/lib/types';
import { formatCurrency, cn } from '@/lib/utils';

export default function FinanzasPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: 'income',
    amount: 0,
    category: 'Venta',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    setTransactions(storage.getTransactions());
  }, []);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const transaction: Transaction = {
      ...(newTransaction as Transaction),
      id: Math.random().toString(36).substr(2, 9),
    };
    const updatedTransactions = [transaction, ...transactions];
    setTransactions(updatedTransactions);
    storage.saveTransactions(updatedTransactions);
    setIsModalOpen(false);
    setNewTransaction({
      type: 'income',
      amount: 0,
      category: 'Venta',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('¿Estás segura de eliminar esta transacción?')) {
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      storage.saveTransactions(updatedTransactions);
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Finanzas</h1>
          <p className="text-foreground/60 mt-1">Sigue el flujo de dinero de tu emprendimiento.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Nueva Transacción
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-muted shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-emerald-50 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/60">Ingresos Totales</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-muted shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-rose-50 p-3 rounded-xl">
              <TrendingDown className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/60">Gastos Totales</p>
              <p className="text-2xl font-bold text-rose-600">{formatCurrency(totalExpense)}</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-muted shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className={cn("p-3 rounded-xl", balance >= 0 ? "bg-primary/10" : "bg-rose-50")}>
              <DollarSign className={cn("w-6 h-6", balance >= 0 ? "text-primary" : "text-rose-600")} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/60">Balance Neto</p>
              <p className={cn("text-2xl font-bold", balance >= 0 ? "text-primary" : "text-rose-600")}>
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card rounded-2xl border border-muted shadow-sm overflow-hidden">
        <div className="p-6 border-b border-muted flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Historial de Transacciones</h2>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-muted text-sm font-medium text-foreground/70 hover:bg-muted/50 transition-colors">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
        </div>
        {transactions.length === 0 ? (
          <div className="p-20 text-center">
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-foreground/20" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Sin movimientos</h3>
            <p className="text-foreground/60 mt-2">No has registrado ninguna transacción todavía.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/50 text-left border-b border-muted">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-foreground/60 uppercase">Fecha</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/60 uppercase">Descripción</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/60 uppercase">Categoría</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/60 uppercase text-right">Monto</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/60 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4 text-sm text-foreground/70">
                    {new Date(t.date).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">
                    {t.description}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-secondary/10 text-primary px-2 py-1 rounded-md text-xs font-bold border border-primary/10">
                      {t.category}
                    </span>
                  </td>
                  <td className={cn(
                    "px-6 py-4 text-right font-bold",
                    t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                  )}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteTransaction(t.id)}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-rose-50 rounded-lg text-foreground/60 hover:text-rose-600 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-muted">
              <h2 className="text-2xl font-bold text-foreground">Nueva Transacción</h2>
              <p className="text-foreground/60">Registra un nuevo ingreso o gasto.</p>
            </div>
            <form onSubmit={handleAddTransaction} className="p-8 space-y-6">
              <div className="flex p-1 bg-muted rounded-2xl">
                <button 
                  type="button"
                  onClick={() => setNewTransaction({...newTransaction, type: 'income'})}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-bold text-sm transition-all",
                    newTransaction.type === 'income' 
                      ? "bg-white text-emerald-600 shadow-sm" 
                      : "text-foreground/40 hover:text-foreground/60"
                  )}
                >
                  Ingreso
                </button>
                <button 
                  type="button"
                  onClick={() => setNewTransaction({...newTransaction, type: 'expense'})}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-bold text-sm transition-all",
                    newTransaction.type === 'expense' 
                      ? "bg-white text-rose-600 shadow-sm" 
                      : "text-foreground/40 hover:text-foreground/60"
                  )}
                >
                  Gasto
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/70 ml-1">Descripción</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Ej. Venta de Agenda Personalizada"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/70 ml-1">Monto</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/70 ml-1">Categoría</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  >
                    {newTransaction.type === 'income' ? (
                      <>
                        <option value="Venta">Venta</option>
                        <option value="Servicio">Servicio</option>
                        <option value="Otros">Otros</option>
                      </>
                    ) : (
                      <>
                        <option value="Materiales">Materiales</option>
                        <option value="Herramientas">Herramientas</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Envío">Envío</option>
                        <option value="Otros">Otros</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/70 ml-1">Fecha</label>
                <input 
                  required
                  type="date" 
                  className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-muted font-bold text-foreground/60 hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={cn(
                    "flex-1 px-6 py-3 rounded-xl text-white font-bold transition-colors shadow-lg shadow-primary/20",
                    newTransaction.type === 'income' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                  )}
                >
                  Guardar Transacción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
