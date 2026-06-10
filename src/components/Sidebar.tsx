
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Wallet, 
  Settings, 
  Heart,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Package, label: 'Inventario', href: '/inventario' },
  { icon: Wallet, label: 'Finanzas', href: '/finanzas' },
  { icon: ShoppingCart, label: 'Ventas', href: '/ventas' },
  { icon: Settings, label: 'Configuración', href: '/configuracion' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isGuest } = useAuth();
  const [logoError, setLogoError] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  if (!user) return null;

  return (
    &lt;&gt;
      {/* Mobile Header */}
      &lt;div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-card border-b border-muted shadow-sm md:hidden"&gt;
        &lt;div className="flex items-center gap-2"&gt;
          {!logoError ? (
            &lt;div className="relative w-8 h-8 overflow-hidden rounded-lg"&gt;
              &lt;Image 
                src="/logo.png" 
                alt="CristiLove Logo" 
                fill 
                sizes="32px"
                className="object-contain"
                onError={() =&gt; setLogoError(true)}
              /&gt;
            &lt;/div&gt;
          ) : (
            &lt;div className="bg-primary/10 p-1.5 rounded-lg"&gt;
              &lt;Heart className="w-5 h-5 text-primary fill-primary" /&gt;
            &lt;/div&gt;
          )}
          &lt;span className="text-lg font-black text-primary tracking-tighter"&gt;CristiLove&lt;/span&gt;
        &lt;/div&gt;
        &lt;button 
          onClick={() =&gt; setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-muted rounded-lg"
        &gt;
          {isMobileMenuOpen ? &lt;X className="w-6 h-6" /&gt; : &lt;Menu className="w-6 h-6" /&gt;}
        &lt;/button&gt;
      &lt;/div&gt;

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen &amp;&amp; (
        &lt;div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() =&gt; setIsMobileMenuOpen(false)}
        /&gt;
      )}

      {/* Sidebar */}
      &lt;aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-card border-r border-muted shadow-sm transition-transform duration-300 md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}&gt;
        &lt;div className="p-6 flex items-center gap-3 hidden md:flex"&gt;
          {!logoError ? (
            &lt;div className="relative w-12 h-12 overflow-hidden rounded-xl"&gt;
              &lt;Image 
                src="/logo.png" 
                alt="CristiLove Logo" 
                fill 
                sizes="48px"
                className="object-contain"
                onError={() =&gt; setLogoError(true)}
              /&gt;
            &lt;/div&gt;
          ) : (
            &lt;div className="bg-primary/10 p-2 rounded-xl"&gt;
              &lt;Heart className="w-8 h-8 text-primary fill-primary" /&gt;
            &lt;/div&gt;
          )}
          &lt;div className="flex flex-col"&gt;
            &lt;span className="text-xl font-black text-primary tracking-tighter leading-none"&gt;CristiLove&lt;/span&gt;
            &lt;span className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-0.5"&gt;Manualidades&lt;/span&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        
        &lt;nav className="flex-1 px-4 space-y-2 mt-4"&gt;
          {menuItems.map((item) =&gt; {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              &lt;Link
                key={item.href}
                href={item.href}
                onClick={() =&gt; setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-white shadow-md" 
                    : "text-foreground/70 hover:bg-secondary/20 hover:text-primary"
                )}
              &gt;
                &lt;Icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-white" : "text-foreground/50 group-hover:text-primary"
                )} /&gt;
                &lt;span className="font-medium"&gt;{item.label}&lt;/span&gt;
              &lt;/Link&gt;
            );
          })}
        &lt;/nav&gt;
        
        &lt;div className="p-6 border-t border-muted space-y-4"&gt;
          &lt;div className="bg-secondary/10 p-4 rounded-2xl border border-secondary/20"&gt;
            &lt;div className="flex items-center gap-3 mb-2"&gt;
              &lt;div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"&gt;
                &lt;User className="w-5 h-5 text-primary" /&gt;
              &lt;/div&gt;
              &lt;div className="flex-1 min-w-0"&gt;
                &lt;p className="text-sm font-bold text-foreground truncate"&gt;{user.name}&lt;/p&gt;
                &lt;p className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  isGuest ? "text-amber-600" : "text-secondary"
                )}&gt;
                  {isGuest ? "Modo Invitado" : "Administrador"}
                &lt;/p&gt;
              &lt;/div&gt;
            &lt;/div&gt;
          &lt;/div&gt;

          &lt;button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all font-medium"
          &gt;
            &lt;LogOut className="w-5 h-5" /&gt;
            &lt;span&gt;Cerrar Sesión&lt;/span&gt;
          &lt;/button&gt;
        &lt;/div&gt;
      &lt;/aside&gt;
    &lt;/&gt;
  );
}
