# =============================================================================
# Dockerfile: Frontend React + Vite + TypeScript
# =============================================================================
# Estrategia: Multi-stage Build (Construccion Multietapa)
#
# Este Dockerfile produce UNA SOLA imagen final con Nginx sirviendo los
# archivos compilados. La misma imagen se usa tanto en desarrollo como
# en produccion; la unica diferencia es la URL base de la API, que se
# configura mediante ARG en tiempo de build.
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
#
# La URL base de la API se configura mediante ARG para que se pueda
# cambiar segun el entorno (dev vs prod) en tiempo de build.
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

# ARG para la URL base de la API (se pasa desde docker-compose --build-arg)
ARG VITE_API_BASE_URL=http://localhost:8081/api

# Establecer como ENV para que Vite lo use en el build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Compilar la aplicacion (TypeScript → JavaScript → bundle optimizado)
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