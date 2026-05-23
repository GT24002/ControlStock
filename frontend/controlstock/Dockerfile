# =============================================================================
# Dockerfile: Frontend React + Vite + TypeScript
# Estrategia: Multi-stage Build para desarrollo y produccion
# =============================================================================

# ──────────────────────────────────────────────────────────────────────────────
# STAGE 1: Dependencies  ---> Instala dependencias primero (cache de capas)
# ──────────────────────────────────────────────────────────────────────────────
FROM node:current-alpine3.23 AS deps

WORKDIR /app

# Copiar solo los archivos de dependencias para cachear la instalacion
COPY package.json package-lock.json ./

# Instalar dependencias (incluyendo devDependencies necesarias para Vite)
RUN npm ci

# ──────────────────────────────────────────────────────────────────────────────
# STAGE 2: Dev  ---> Servidor de desarrollo Vite con HMR
# ──────────────────────────────────────────────────────────────────────────────
# NOTA: No se copian node_modules desde deps porque el bind mount del codigo
#       en docker-compose monta el directorio completo del host. En su lugar,
#       se usa un script de entrada que ejecuta 'npm install' para sincronizar
#       las dependencias cada vez que se inicia el contenedor.
#       Esto garantiza que los paquetes instalados en modo hibrido (npm install
#       directo en el host) se reflejen correctamente al usar el modo Docker.
# ──────────────────────────────────────────────────────────────────────────────
FROM node:current-alpine3.23 AS dev

WORKDIR /app

# Copiar archivos de configuracion del proyecto (no node_modules)
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY eslint.config.js ./
COPY public ./public

# No copiamos node_modules — se instalaran al arrancar el contenedor
# (el bind mount expone package.json y package-lock.json del host)

# Variable de entorno para forzar polling en Docker
ENV CHOKIDAR_USEPOLLING=1
ENV CHOKIDAR_INTERVAL=1000

# URL base de la API para el entorno de desarrollo
ENV VITE_API_BASE_URL=http://localhost:8080/api

# Script de entrada: ejecuta npm install si es necesario, luego inicia Vite
# Esto asegura que las dependencias instaladas en modo hibrido se sincronicen
RUN printf '#!/bin/sh\n\
echo "[dev-entrypoint] Verificando dependencias..."\n\
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then\n\
  echo "[dev-entrypoint] node_modules no encontrado o incompleto. Ejecutando npm install..."\n\
  npm install\n\
else\n\
  # Verificar si package-lock.json cambio respecto a node_modules\n\
  if ! cmp -s /app/package-lock.json /app/node_modules/.package-lock.json 2>/dev/null; then\n\
    echo "[dev-entrypoint] package-lock.json ha cambiado. Reinstalando dependencias..."\n\
    npm install\n\
  else\n\
    echo "[dev-entrypoint] Dependencias actualizadas. Saltando npm install."\n\
  fi\n\
fi\n\
echo "[dev-entrypoint] Iniciando Vite..."\n\
exec npx vite --host 0.0.0.0 --port 5173\n' > /usr/local/bin/dev-entrypoint.sh && \
chmod +x /usr/local/bin/dev-entrypoint.sh

# Exponer puerto del servidor de desarrollo Vite
EXPOSE 5173

ENTRYPOINT ["/usr/local/bin/dev-entrypoint.sh"]

# ──────────────────────────────────────────────────────────────────────────────
# STAGE 3: Build  ---> Compila para produccion
# ──────────────────────────────────────────────────────────────────────────────
FROM node:current-alpine3.23 AS build

WORKDIR /app

# Copiar dependencias desde la etapa deps
COPY --from=deps /app/node_modules ./node_modules

# Copiar todo el codigo fuente
COPY . .

# URL base de la API para el entorno de produccion
ENV VITE_API_BASE_URL=http://localhost:8081/api

# Compilar la aplicacion para produccion
RUN npm run build

# ──────────────────────────────────────────────────────────────────────────────
# STAGE 4: Prod  ---> Sirve los archivos estáticos con nginx
# ──────────────────────────────────────────────────────────────────────────────
FROM nginx:alpine AS prod

# Copiar configuracion personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos compilados desde la etapa build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]