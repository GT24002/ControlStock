import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

/**
 * Instancia centralizada de Axios.
 * Lee la URL base desde VITE_API_BASE_URL (variable de entorno),
 * configura timeout e interceptores para peticiones y respuestas.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ------------------------------------------------------------------ */
/*  Interceptor de petición: agrega token de autenticacion si existe   */
/* ------------------------------------------------------------------ */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/* ------------------------------------------------------------------ */
/*  Interceptor de respuesta: manejo centralizado de errores HTTP      */
/* ------------------------------------------------------------------ */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Token expirado o inválido → limpiar sesión
          localStorage.removeItem("auth_token");
          // Redirigir al login (si hay router disponible)
          window.location.href = "/login";
          break;
        case 403:
          console.error("Acceso denegado (403)");
          break;
        case 404:
          console.error("Recurso no encontrado (404)");
          break;
        case 500:
          console.error("Error interno del servidor (500)", data);
          break;
        default:
          console.error(`Error HTTP ${status}:`, data);
      }
    } else if (error.request) {
      // No se recibió respuesta (red caída, timeout, etc.)
      console.error("No se pudo conectar con el servidor");
    }

    return Promise.reject(error);
  },
);

export default apiClient;