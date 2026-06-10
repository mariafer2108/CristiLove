'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Wallet, 
  Settings, 
  Heart,
  ShoppingCart,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Package, label: 'Inventario', href: '/inventario' },
  { icon: Wallet, label: 'Finanzas', href: '/finanzas' },
  { icon: ShoppingCart, label: 'Ventas', href: '/ventas' },
  { icon: Settings, label: 'Configuración', href: '/configuracion' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [logoError, setLogoError] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-card border-b border-muted shadow-sm md:hidden">
        <div className="flex items-center gap-2">
          {!logoError ? (
            <div className="relative w-8 h-8 overflow-hidden rounded-lg">
              <Image 
                src="/logo.png" 
                alt="CristiLove Logo" 
                fill 
                sizes="32px"
                className="object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Heart className="w-5 h-5 text-primary fill-primary" />
            </div>
          )}
          <span className="text-lg font-black text-primary tracking-tighter">CristiLove</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-muted rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-card border-r border-muted shadow-sm transition-transform duration-300 md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3 hidden md:flex">
          {!logoError ? (
            <div className="relative w-12 h-12 overflow-hidden rounded-xl">
              <Image 
                src="/logo.png" 
                alt="CristiLove Logo" 
                fill 
                sizes="48px"
                className="object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <div className="bg-primary/10 p-2 rounded-xl">
              <Heart className="w-8 h-8 text-primary fill-primary" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xl font-black text-primary tracking-tighter leading-none">CristiLove</span>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-0.5">Manualidades</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-white shadow-md" 
                    : "text-foreground/70 hover:bg-secondary/20 hover:text-primary"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-white" : "text-foreground/50 group-hover:text-primary"
                )} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-muted">
          <div className="bg-secondary/10 p-4 rounded-2xl border border-secondary/20">
            <p className="text-xs text-foreground/60 font-medium uppercase tracking-wider mb-1">Tu Negocio</p>
            <p className="text-sm font-bold text-foreground">Papelería Creativa</p>
          </div>
        </div>
      </aside>
    </>
  );
}