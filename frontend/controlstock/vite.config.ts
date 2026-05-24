import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    // Permitir conexiones desde cualquier interfaz de red (necesario en Docker)
    host: "0.0.0.0",
    port: 5173,
    // Hot Module Replacement forzado por WebSocket explicito
    hmr: {
      host: "localhost",
      port: 5173,
      protocol: "ws"
    },
    // --- Configuracion critica para Docker ---
    watch: {
      // usePolling: Fuerza a Vite a usar polling en lugar de eventos del sistema
      // de archivos (fs events). Esto es necesario porque los sistemas de
      // archivos montados en Docker (bind mounts en Windows/Mac) no disparan
      // eventos nativos de forma confiable, lo que impediria el Hot Reload.
      usePolling: true,
      // Intervalo de polling en milisegundos (menor = mas reactivo, mayor = menos CPU)
      interval: 1000
    }
  }
})
