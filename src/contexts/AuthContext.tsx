
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'guest';
}

interface AuthContextType {
  user: User | null;
  login: (name: string, role: 'admin' | 'guest') => void;
  logout: () => void;
  isGuest: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext&lt;AuthContextType | undefined&gt;(undefined);

export const AuthProvider: React.FC&lt;{ children: ReactNode }&gt; = ({ children }) =&gt; {
  const [user, setUser] = useState&lt;User | null&gt;(null);

  useEffect(() =&gt; {
    const savedUser = localStorage.getItem('cristilove_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (name: string, role: 'admin' | 'guest') =&gt; {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      role,
    };
    localStorage.setItem('cristilove_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () =&gt; {
    localStorage.removeItem('cristilove_user');
    setUser(null);
  };

  return (
    &lt;AuthContext.Provider value={{ user, login, logout, isGuest: user?.role === 'guest', isAdmin: user?.role === 'admin' }}&gt;
      {children}
    &lt;/AuthContext.Provider&gt;
  );
};

export const useAuth = () =&gt; {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
