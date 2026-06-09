import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../types';

export interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Contexto global de autenticación
export const AuthContext = createContext<AuthContextType | null>(null);

// Proveedor que envuelve toda la app y maneja la sesión
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('auth', JSON.stringify(user));
    else localStorage.removeItem('auth');
  }, [user]);

  const login = (userData: AuthUser) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
