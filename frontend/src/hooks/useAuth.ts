import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Hook para consumir el contexto de autenticación
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};