# Dockerización de ControlStock

> **Documentación Técnica** — Arquitectura de Contenedores con Hot Reload  
> *Stack: PostgreSQL 16.13 || Spring Boot 3 + Java 21 || React + Vite + TypeScript*

---

## 1. Arquitectura General - Entorno de Desarrollo

El sistema se compone de **tres servicios** interconectados mediante una red Docker bridge personalizada (`controlstock_network_dev`):

```
┌────────────────────────────────────────────────────────────┐
│        docker compose -p controlstock-dev --profile dev     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────┐     ┌──────────────┐     ┌────────────┐  │
│  │ frontend-dev  │     │ backend-dev  │     │   db-dev   │  │
│  │  React/Vite   │────▶│ Spring Boot  │────▶│  Postgres  │  │
│  │  :5173        │     │  :8080       │     │  :5433     │  │
│  └──────────────┘     └──────────────┘     └────────────┘  │
│       │                      │                 │           │
│       ▼                      ▼                 ▼           │
│  Bind Mount            Bind Mount           Named          │
│  (HMR listo)          + Maven cache        Volume         │
│                       (DevTools listo)    (persist.)      │
└────────────────────────────────────────────────────────────┘
```

---

## 2. Configuración Aplicada por Servicio

### 2.1 PostgreSQL - Desarrollo (`db-dev`)

| Elemento | Configuración |
|----------|--------------|
| **Imagen** | `postgres:16.13-alpine3.23` |
| **Puerto interno** | `5432` (contenedor) |
| **Puerto expuesto** | `5433` (host) |
| **Persistencia** | `Named Volume` → `controlstock_pgdata_dev` |
| **Inicialización** | Bind mount `./database:/docker-entrypoint-initdb.d:ro` |
| **Healthcheck** | `pg_isready -U admin -d controlstock` cada 10s, 5 reintentos |
| **Red** | `controlstock-net-dev` |

**¿Qué se logra?**  
- Los datos sobreviven a `docker compose -p controlstock-dev down` porque el **Named Volume** almacena los datos en el área gestionada por Docker.
- Los scripts SQL de `./database/` se ejecutan **solo la primera vez** que el contenedor arranca con un volumen vacío.

### 2.2 Backend Spring Boot - Desarrollo (`backend-dev`)

| Elemento | Configuración |
|----------|--------------|
| **Build** | Multi-stage: `builder` (Maven compila) → `dev` (JRE ejecuta con DevTools) |
| **Puertos** | `8080` (app), `5005` (JDWP), `35729` (LiveReload) |
| **Volumen código** | Bind mount `./backend/controlstock:/app` |
| **Caché Maven** | Named Volume `controlstock_m2_cache_dev` |
| **DevTools** | `restart.enabled=true`, `livereload.enabled=true` |
| **JDWP** | `address=*:5005`, `suspend=n` |

**¿Qué se logra?**  
- **Hot Reload en Java**: Spring Boot DevTools monitorea el classpath y recarga el contexto en ~1-3 segundos.
- **Depuración remota**: Puerto 5005 expuesto para conectar IntelliJ/VSCode.
- **Caché de Maven persistente**: Las dependencias descargadas no se pierden al reconstruir.

### 2.3 Frontend React + Vite - Desarrollo (`frontend-dev`)

| Elemento | Configuración |
|----------|--------------|
| **Build** | Multi-stage: `deps` (npm ci) → `dev` (Vite server) |
| **Puerto** | `5173:5173` |
| **Volumen código** | Bind mount `./frontend/controlstock:/app` |
| **Sincronización de dependencias** | Script `dev-entrypoint.sh` que ejecuta `npm install` al arrancar si detecta cambios en `package-lock.json` |
| **Polling forzado** | `CHOKIDAR_USEPOLLING=1`, `CHOKIDAR_INTERVAL=1000` |

**¿Qué se logra?**  
- **Hot Module Replacement (HMR)**: Editar → Guardar → Ver cambio en el navegador (~50-200ms).
- **Sincronización automática de dependencias**: Al instalar un paquete con `npm install` en modo híbrido, al ejecutar el modo Docker el contenedor detecta el cambio en `package-lock.json` y ejecuta `npm install` automáticamente para reflejar los nuevos paquetes.

- **Polling como fallback**: Funciona en Docker Desktop (Windows/Mac) donde los eventos nativos no se propagan.

---

## 3. Sustento Técnico de Decisiones

### 3.1 ¿Por qué Named Volume para PostgreSQL y no Bind Mount?

| Aspecto | Named Volume | Bind Mount |
|---------|-------------|------------|
| **Rendimiento** | ✅ Nativo, sin overhead de traducción | ❌ 30-50% más lento en Windows/Mac |
| **Portabilidad** | ✅ Funciona idéntico en Windows, Mac y Linux | ❌ Las rutas varían por SO |
| **Integridad** | ✅ Docker gestiona el ciclo de vida | ❌ Riesgo de corrupción |
| **Permisos** | ✅ Postgres controla permisos (uid 70) | ❌ Conflictos de propietario |

### 3.2 ¿Por qué activar `usePolling` en Vite?

En Docker Desktop (Windows/Mac), los bind mounts no propagan eventos de sistema de archivos de forma confiable. `usePolling: true` fuerza a Vite a verificar cambios periódicamente (cada 1000ms) mediante polling, sacrificando ~1-2% de CPU para lograr HMR funcional.

### 3.3 ¿Por qué "Build project automatically" en el IDE para Spring Boot?

```
Host (IDE)          Contenedor Docker (Backend)
   │                        │
   │  Guardar .java         │
   │  ─────────────────▶    │
   │                        │
   │  [IDE compila]         │
   │  genera .class         │
   │  en target/            │
   │                        │
   │  (bind mount)          │
   │  target/classes/       │
   │                        │
   │  ─────────────────▶    │  Spring DevTools
   │                   detecta cambio
   │                   en classpath
   │                   Reinicia contexto (~2-3s)
   │                        │
   │  ←────────────────  App lista
```

---

## 4. Comandos de Uso Diario

### Entorno de Desarrollo

```bash
# ─── Iniciar TODO el entorno de desarrollo ───
docker compose -p controlstock-dev --profile dev up --build

# ─── Solo PostgreSQL (para modo híbrido con IDE local) ───
docker compose -p controlstock-dev up db-dev -d

# ─── Ver logs de un servicio específico ───
docker compose -p controlstock-dev logs -f backend-dev
docker compose -p controlstock-dev logs -f frontend-dev
docker compose -p controlstock-dev logs -f db-dev

# ─── Ejecutar comandos Maven dentro del contenedor ───
docker compose -p controlstock-dev exec backend-dev mvn compile
docker compose -p controlstock-dev exec backend-dev mvn test

# ─── Ejecutar comandos npm dentro del contenedor ───
docker compose -p controlstock-dev exec frontend-dev npm install axios
docker compose -p controlstock-dev exec frontend-dev npm run build

# ─── Acceder a la consola de PostgreSQL ───
docker compose -p controlstock-dev exec db-dev psql -U admin -d controlstock

# ─── Detener servicios (conserva datos y volúmenes) ───
docker compose -p controlstock-dev down

# ─── Detener y eliminar volúmenes (⚠️ borra datos de BD) ───
docker compose -p controlstock-dev down -v

# ─── Reconstruir sin caché ───
docker compose -p controlstock-dev build --no-cache
docker compose -p controlstock-dev --profile dev up
```

### Manejando nuevas dependencias

```bash
# ─── Instalar un nuevo paquete npm (modo híbrido) ───
cd frontend/controlstock
npm install axios

# Al ejecutar el modo Docker después, el contenedor detectará
# automáticamente el cambio y ejecutará npm install.

# ─── Si es necesario forzar la reinstalación ───
docker compose -p controlstock-dev exec frontend-dev npm install

# ─── Para nuevas dependencias Maven, reconstruir la imagen ───
docker compose -p controlstock-dev build backend-dev
docker compose -p controlstock-dev --profile dev up
```

### Entorno de Producción

```bash
# ─── Iniciar entorno de producción ───
docker compose -p controlstock-prod --profile prod up --build -d

# ─── Ver logs ───
docker compose -p controlstock-prod logs -f backend-prod
docker compose -p controlstock-prod logs -f frontend-prod
docker compose -p controlstock-prod logs -f db-prod

# ─── Detener producción ───
docker compose -p controlstock-prod down
```

---

## 5. Estructura Final de Archivos

```
ControlStock/
├── .dockerignore                    ← Excluye archivos del contexto de build
├── docker-compose.yml               ← Orquestación (dev + prod)
├── Docker_GETTING_STARTED.md        ← Guía rápida para desarrolladores
├── docker-dev-setup.md              ← Esta documentación técnica
│
├── backend/controlstock/
│   ├── .dockerignore                ← Excluye target/, .git/, etc.
│   ├── Dockerfile                   ← Multi-stage: builder → dev → prod
│   ├── pom.xml
│   └── src/main/resources/
│       └── application.properties   ← Configuracion unica (modo hibrido + Docker)
│
├── frontend/controlstock/
│   ├── .dockerignore                ← Excluye node_modules/, dist/, etc.
│   ├── Dockerfile                   ← Multi-stage: deps → dev → build → prod
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│
└── database/
    ├── 1-create_tables.sql
    ├── 2-seed_data.sql
    └── ...
```

---

## 6. Resumen de Buenas Prácticas Implementadas

| Práctica | Beneficio |
|----------|-----------|
| **Multi-stage build** | Imágenes más pequeñas (dev vs prod), separación de responsabilidades |
| **Named Volume para BD** | Rendimiento nativo, portabilidad, integridad de datos |
| **Bind mount + entrypoint script (frontend)** | Sincronización automática de dependencias npm entre modo híbrido y Docker |
| **.dockerignore en cada contexto** | Builds más rápidos al excluir archivos innecesarios del contexto de Docker |
| **usePolling en Vite** | HMR funciona en Docker Desktop (Windows/Mac) |
| **DevTools + compilación automática** | Hot Reload en Java ~2s |
| **Healthcheck en PostgreSQL** | Arranque ordenado sin race conditions |
| **Caché de Maven persistente** | Builds rápidos en iteraciones |
| **Red bridge personalizada** | Aislamiento y resolución DNS por nombre de servicio |
| **JDWP expuesto** | Depuración remota desde el IDE |
| **Scripts SQL versionados** | Inicialización reproducible de la BD |
| **Perfiles dev y prod unificados** | Un solo `docker-compose.yml` para ambos entornos |
| **Nombres de proyecto separados** | `controlstock-dev` y `controlstock-prod` pueden coexistir |