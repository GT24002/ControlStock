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
FROM node:current-alpine3.23 AS dev

WORKDIR /app

# Copiar node_modules desde la etapa de dependencias
COPY --from=deps /app/node_modules ./node_modules

# Copiar archivos de configuracion del proyecto
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY eslint.config.js ./
COPY public ./public

# No copiamos src en el build — se monta como bind mount en docker-compose
# para que los cambios en tiempo real sean visibles para Vite

# Exponer puerto del servidor de desarrollo Vite
EXPOSE 5173

# Variable de entorno para forzar polling en Docker
ENV CHOKIDAR_USEPOLLING=1
ENV CHOKIDAR_INTERVAL=1000

# URL base de la API para el entorno de desarrollo
ENV VITE_API_BASE_URL=http://localhost:8080/api

# Iniciar Vite en modo desarrollo con --host para aceptar conexiones externas
# El flag --host 0.0.0.0 es obligatorio para que funcione dentro del contenedor
ENTRYPOINT ["npx", "vite", "--host", "0.0.0.0", "--port", "5173"]

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