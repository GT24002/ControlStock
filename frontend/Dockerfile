# =============================================================================
# Dockerfile: Frontend React + Vite + TypeScript
# =============================================================================
# Estrategia: Multi-stage Build (Construccion Multietapa)
# 
# Etapas (stages):
#   1. deps    → Instala dependencias npm (cache de capas)
#   2. build   → Compila la aplicacion para produccion (genera dist/)
#   3. final   → Nginx sirve los archivos estaticos
#
# Beneficios del multi-stage:
#   - La etapa 'deps' aprovecha la cache de Docker: mientras package.json
#     y package-lock.json no cambien, las dependencias NO se reinstalan
#   - La etapa 'final' solo contiene nginx + dist/
# =============================================================================


# =============================================================================
# STAGE 1: deps  ---> Instala dependencias (cache de capas)
# =============================================================================
# Proposito: Instalar todas las dependencias (incluyendo devDependencies)
# utilizando 'npm ci' para asegurar una instalacion determinista basada
# en package-lock.json.
#
# Esta etapa se cachea por completo mientras los archivos de dependencias
# no cambien, acelerando significativamente las reconstrucciones.
# =============================================================================
FROM node:current-alpine3.23 AS deps

WORKDIR /app

# Copiar SOLO los archivos de dependencias para maximizar el cache
COPY package.json package-lock.json ./

# npm ci (clean install) es mas rapido y determinista que npm install:
#   - Elimina node_modules existente antes de instalar
#   - Falla si package-lock.json no coincide con package.json
#   - No modifica package-lock.json
RUN npm ci


# =============================================================================
# STAGE 2: build  ---> Compila la aplicacion para produccion
# =============================================================================
# Proposito: Compilar la aplicacion React + TypeScript a archivos estaticos
# (HTML, JS, CSS) optimizados para produccion. El resultado se guarda
# en el directorio 'dist/' dentro de la imagen.
# =============================================================================
FROM node:current-alpine3.23 AS build

WORKDIR /app

# Copiar dependencias desde la etapa 'deps'
COPY --from=deps /app/node_modules ./node_modules

# Copiar package.json (necesario para npm run build, scripts, etc.)
COPY package.json package-lock.json ./

# Copiar todo el codigo fuente necesario para la compilacion
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY eslint.config.js ./
COPY public ./public
COPY src ./src

# Compilar la aplicacion para produccion (genera dist/)
RUN npm run build


# =============================================================================
# STAGE 3: final  ---> Sirve los archivos estaticos con Nginx   
# =============================================================================
# Proposito: Imagen unica para desarrollo y produccion.
#
# Nginx hace dos cosas:
#   1. Servir archivos estaticos con compresion Gzip
#   2. Redirigir /api/* al backend (proxy reverso, evitando CORS)
#
# En desarrollo, el proxy apunta a backend-dev:8080.
# En produccion, el proxy apunta a backend-prod:8080.
# Esto se configura en el nginx.conf segun el contenedor destino.
# =============================================================================
FROM nginx:alpine AS final

# Copiar configuracion personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos compilados desde la etapa build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]