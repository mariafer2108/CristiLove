
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Sparkles, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() =&gt; {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleAdminLogin = (e: React.FormEvent) =&gt; {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Por favor, ingresa tu nombre');
      return;
    }

    // Contraseña simple (puedes cambiarla más tarde)
    if (password !== 'cristilove2024') {
      setError('Contraseña incorrecta');
      return;
    }

    login(name, 'admin');
    router.push('/');
  };

  const handleGuestLogin = () =&gt; {
    login('Invitado', 'guest');
    router.push('/');
  };

  return (
    &lt;div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-white to-purple-50"&gt;
      &lt;div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-muted overflow-hidden"&gt;
        &lt;div className="p-8 text-center space-y-4 bg-gradient-to-r from-pink-50 to-purple-50 border-b border-muted"&gt;
          &lt;div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl shadow-lg shadow-primary/20"&gt;
            &lt;Heart className="w-10 h-10 text-white fill-white" /&gt;
          &lt;/div&gt;
          &lt;div&gt;
            &lt;h1 className="text-3xl font-extrabold text-foreground"&gt;CristiLove&lt;/h1&gt;
            &lt;p className="text-foreground/60 mt-1"&gt;Gestiona tu papelería creativa&lt;/p&gt;
          &lt;/div&gt;
          &lt;Sparkles className="w-5 h-5 text-yellow-400 mx-auto" /&gt;
        &lt;/div&gt;

        &lt;div className="p-8 space-y-6"&gt;
          &lt;form onSubmit={handleAdminLogin} className="space-y-5"&gt;
            &lt;div className="space-y-2"&gt;
              &lt;label className="text-sm font-bold text-foreground/70 ml-1 flex items-center gap-2"&gt;
                &lt;User className="w-4 h-4" /&gt;
                Tu nombre
              &lt;/label&gt;
              &lt;input
                type="text"
                required
                placeholder="Ej. Maria Fernanda"
                className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                value={name}
                onChange={(e) =&gt; setName(e.target.value)}
              /&gt;
            &lt;/div&gt;

            &lt;div className="space-y-2"&gt;
              &lt;label className="text-sm font-bold text-foreground/70 ml-1 flex items-center gap-2"&gt;
                &lt;Lock className="w-4 h-4" /&gt;
                Contraseña
              &lt;/label&gt;
              &lt;div className="relative"&gt;
                &lt;input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  value={password}
                  onChange={(e) =&gt; setPassword(e.target.value)}
                /&gt;
                &lt;button
                  type="button"
                  onClick={() =&gt; setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/60 transition-colors"
                &gt;
                  {showPassword ? &lt;EyeOff className="w-5 h-5" /&gt; : &lt;Eye className="w-5 h-5" /&gt;}
                &lt;/button&gt;
              &lt;/div&gt;
            &lt;/div&gt;

            {error &amp;&amp; (
              &lt;div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium border border-rose-100"&gt;
                {error}
              &lt;/div&gt;
            )}

            &lt;button
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:bg-primary/90 transition-all active:scale-[0.98]"
            &gt;
              Iniciar Sesión como Administrador
            &lt;/button&gt;
          &lt;/form&gt;

          &lt;div className="relative"&gt;
            &lt;div className="absolute inset-0 flex items-center"&gt;
              &lt;div className="w-full border-t border-muted" /&gt;
            &lt;/div&gt;
            &lt;div className="relative flex justify-center text-sm"&gt;
              &lt;span className="px-4 bg-white text-foreground/40 font-bold"&gt;o bien&lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;

          &lt;button
            onClick={handleGuestLogin}
            className="w-full bg-muted text-foreground py-4 rounded-xl font-bold border border-muted hover:bg-muted/70 transition-all active:scale-[0.98]"
          &gt;
            Ver como Invitado (Solo Lectura)
          &lt;/button&gt;
        &lt;/div&gt;

        &lt;div className="p-6 text-center text-xs text-foreground/40 bg-muted/20"&gt;
          &lt;p&gt;Tu contraseña es: &lt;span className="font-bold text-foreground/60"&gt;cristilove2024&lt;/span&gt;&lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
