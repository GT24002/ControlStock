import axios from 'axios';

// Instancia base de axios apuntando al backend
const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: agrega el token JWT a cada petición automáticamente
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('auth');
  if (stored) {
    const { token } = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: si el token expiró redirige al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
