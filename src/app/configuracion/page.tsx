'use client';

import React from 'react';
import { Settings, User, Bell, Shield, Heart } from 'lucide-react';
import Image from 'next/image';

export default function ConfiguracionPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-foreground/60 mt-1">Personaliza tu experiencia en CristiLove.</p>
      </div>

      <div className="bg-card rounded-2xl border border-muted shadow-sm divide-y divide-muted">
        <div className="p-6 flex items-center justify-between group cursor-pointer hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-xl text-primary">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-foreground">Perfil del Negocio</p>
              <p className="text-sm text-foreground/50">Nombre, logo y detalles de contacto.</p>
            </div>
          </div>
          <button className="text-sm font-bold text-primary">Editar</button>
        </div>

        <div className="p-6 flex items-center justify-between group cursor-pointer hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-foreground">Notificaciones de Stock</p>
              <p className="text-sm text-foreground/50">Configura alertas para productos bajos.</p>
            </div>
          </div>
          <button className="text-sm font-bold text-primary">Configurar</button>
        </div>

        <div className="p-6 flex items-center justify-between group cursor-pointer hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-foreground">Seguridad y Datos</p>
              <p className="text-sm text-foreground/50">Exportar datos o limpiar almacenamiento local.</p>
            </div>
          </div>
          <button className="text-sm font-bold text-primary">Gestionar</button>
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
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <div className="w-3 h-3 rounded-full bg-secondary"></div>
          <div className="w-3 h-3 rounded-full bg-accent"></div>
          <div className="w-3 h-3 rounded-full bg-orange"></div>
        </div>
      </div>
    </div>
  );
}
