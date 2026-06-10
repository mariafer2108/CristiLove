'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Heart, 
  Download, 
  Trash2, 
  CheckCircle2,
  Store,
  Wallet
} from 'lucide-react';
import Image from 'next/image';
import { storage } from '@/lib/storage';
import { AppConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setConfig(storage.getConfig());
  }, []);

  const handleSave = () => {
    if (!config) return;
    setIsSaving(true);
    storage.saveConfig(config);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  const handleExport = () => {
    storage.exportData();
  };

  const handleClear = () => {
    storage.clearAllData();
  };

  if (!config) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
          <p className="text-foreground/60 mt-1">Personaliza tu experiencia en CristiLove.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg",
            saveSuccess 
              ? "bg-emerald-500 text-white shadow-emerald-200" 
              : "bg-primary text-white shadow-primary/20 hover:bg-primary/90"
          )}
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saveSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Guardado
            </>
          ) : (
            <>
              <Settings className="w-5 h-5" />
              Guardar Cambios
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Perfil del Negocio */}
        <div className="bg-card rounded-2xl border border-muted shadow-sm overflow-hidden">
          <div className="p-6 border-b border-muted bg-muted/20">
            <div className="flex items-center gap-3 text-primary">
              <Store className="w-6 h-6" />
              <h2 className="font-bold text-lg">Perfil del Negocio</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/70 ml-1">Nombre de la Tienda</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                value={config.shopName}
                onChange={(e) => setConfig({...config, shopName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/70 ml-1">Nombre de Propietaria</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                value={config.ownerName}
                onChange={(e) => setConfig({...config, ownerName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/70 ml-1">Moneda</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                value={config.currency}
                onChange={(e) => setConfig({...config, currency: e.target.value})}
              >
                <option value="CLP">CLP ($ - Peso Chileno)</option>
                <option value="USD">USD ($ - Dólar)</option>
                <option value="COP">COP ($ - Peso Colombiano)</option>
                <option value="MXN">MXN ($ - Peso Mexicano)</option>
                <option value="ARS">ARS ($ - Peso Argentino)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notificaciones y Preferencias */}
        <div className="bg-card rounded-2xl border border-muted shadow-sm overflow-hidden">
          <div className="p-6 border-b border-muted bg-muted/20">
            <div className="flex items-center gap-3 text-amber-600">
              <Bell className="w-6 h-6" />
              <h2 className="font-bold text-lg">Preferencias</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Alertas de Stock Bajo</p>
                <p className="text-xs text-foreground/50">Recibir avisos en el dashboard.</p>
              </div>
              <button 
                onClick={() => setConfig({...config, lowStockAlert: !config.lowStockAlert})}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  config.lowStockAlert ? "bg-primary" : "bg-muted"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  config.lowStockAlert ? "left-7" : "left-1"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Reporte Diario</p>
                <p className="text-xs text-foreground/50">Resumen de ventas al final del día.</p>
              </div>
              <button 
                onClick={() => setConfig({...config, dailyReport: !config.dailyReport})}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  config.dailyReport ? "bg-primary" : "bg-muted"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  config.dailyReport ? "left-7" : "left-1"
                )} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seguridad y Datos */}
      <div className="bg-card rounded-2xl border border-muted shadow-sm overflow-hidden">
        <div className="p-6 border-b border-muted bg-muted/20">
          <div className="flex items-center gap-3 text-blue-600">
            <Shield className="w-6 h-6" />
            <h2 className="font-bold text-lg">Seguridad y Datos</h2>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-blue-200 text-blue-600 font-bold hover:bg-blue-50 transition-colors"
          >
            <Download className="w-5 h-5" />
            Exportar Copia de Seguridad
          </button>
          <button 
            onClick={handleClear}
            className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-rose-200 text-rose-600 font-bold hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Limpiar Todos los Datos
          </button>
        </div>
      </div>

      <div className="bg-secondary/10 p-10 rounded-[3rem] border-4 border-white shadow-xl flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full -ml-16 -mb-16 blur-3xl"></div>
        
        <div className="relative w-40 h-40 mb-6 drop-shadow-2xl">
          <Image 
            src="/logo.png" 
            alt="CristiLove Logo" 
            fill 
            sizes="160px"
            className="object-contain"
          />
        </div>
        
        <h2 className="text-3xl font-black text-primary tracking-tighter">CristiLove v1.0</h2>
        <p className="text-foreground/70 mt-4 max-w-md text-lg font-medium leading-relaxed">
          Hecho con mucho ❤️ para tu emprendimiento de manualidades y papelería creativa.
        </p>
        <div className="flex gap-2 mt-6">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-secondary animate-pulse delay-75"></div>
          <div className="w-3 h-3 rounded-full bg-accent animate-pulse delay-150"></div>
          <div className="w-3 h-3 rounded-full bg-orange animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
}