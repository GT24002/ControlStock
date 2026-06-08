# Dockerización de ControlStock

> **Documentación Técnica** — Arquitectura de Contenedores  
> *Stack: PostgreSQL 16.13 || Spring Boot 3 + Java 21 || React + Vite + TypeScript*

---

## 1. Arquitectura General - Entorno de Desarrollo

El sistema se compone de **dos servicios** interconectados mediante una red Docker bridge personalizada (`controlstock_network_dev`), y el backend se conecta a una base de datos PostgreSQL **externa local** (no dockerizada) usando `host.docker.internal`.

```
┌────────────────────────────────────────────────────────────┐
│        docker compose -p controlstock-dev --profile dev     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────┐     ┌──────────────┐     ┌────────────┐  │
│  │  Nginx        │     │ Spring Boot  │     │  PostgreSQL│  │
│  │  Sirve SPA    │────▶│  :8080       │────▶│ EXTERNA    │  │
│  │  :5173        │     │              │     │ (Local)    │  │
│  └──────────────┘     └──────────────┘     └────────────┘  │
│                            ▲                                │
│                    alias "backend"                           │
│                    (resoluble via DNS Docker)                │
└────────────────────────────────────────────────────────────┘
```

**IMPORTANTE**: Se usa una **única imagen Docker** tanto para desarrollo como para producción. La única diferencia entre entornos son las variables de entorno y los ARG de build que configuran la URL de conexión a la BD y la URL base de la API.

---

## 2. Estrategia de Imagen Única

| Aspecto | Backend | Frontend |
|---------|---------|----------|
| **Dockerfile** | `builder` → `final` | `deps` → `build` → `final` |
| **Imagen** | `controlstock-backend:latest` | `controlstock-frontend:latest` |
| **Variación dev/prod** | Solo cambia `SPRING_DATASOURCE_URL` (variable entorno) | Solo cambia `VITE_API_BASE_URL` (ARG build) |
| **Proxy Nginx** | Apunta a `backend:8080` (alias de red) | — |

---

## 3. Configuración Aplicada por Servicio

### 3.1 Backend Spring Boot - Desarrollo (`backend-dev`)

| Elemento | Configuración |
|----------|--------------|
| **Build** | Multi-stage: `builder` (Maven compila) → `final` (JRE Alpine, usuario no-root) |
| **Puerto** | `8080` (API REST) |
| **Conexión BD** | `host.docker.internal:5432` → PostgreSQL externa local |
| **Alias red** | `backend` (para que Nginx resuelva el nombre) |

### 3.2 Frontend React + Nginx - Desarrollo (`frontend-dev`)

| Elemento | Configuración |
|----------|--------------|
| **Build** | Multi-stage: `deps` (npm ci) → `build` (compila) → `final` (Nginx) |
| **Puerto** | `5173:80` (host:contenedor) |
| **ARG build** | `VITE_API_BASE_URL=http://localhost:8080/api` |
| **Proxy reverso** | Nginx redirige `/api/*` a `backend:8080` (alias de red) |

---

## 4. Sustento Técnico de Decisiones

### 4.1 ¿Por qué una sola imagen para dev y prod?

- **Consistencia**: Lo que ejecutas en desarrollo es exactamente lo mismo que en producción
- **Simplicidad**: No hay perfiles ni targets que recordar
- **Cache eficiente**: La imagen se construye una vez y se reutiliza
- **Menos espacio**: Una sola imagen en lugar de dos

### 4.2 ¿Cómo se diferencian dev y prod si usan la misma imagen?

| Aspecto | Dev | Prod |
|---------|-----|------|
| **BD** | PostgreSQL externa local (`host.docker.internal:5432`) | PostgreSQL dockerizada (`db-prod:5432`) |
| **API URL (frontend)** | `http://localhost:8080/api` (ARG build) | `http://localhost:8081/api` (ARG build) |
| **Puerto frontend** | `5173` (evita conflictos) | `80` (HTTP estándar) |

---

## 5. Comandos de Uso Diario

### Entorno de Desarrollo (con BD externa local)

```bash
# Requisito: Tener PostgreSQL corriendo localmente en puerto 5432
# con base de datos 'controlstock', usuario 'admin', contraseña 'admin123'

# ─── Iniciar TODO el entorno de desarrollo ───
docker compose -p controlstock-dev --profile dev up --build

# ─── Ver logs ───
docker compose -p controlstock-dev logs -f backend-dev
docker compose -p controlstock-dev logs -f frontend-dev

# ─── Detener ───
docker compose -p controlstock-dev down
```

### Entorno de Producción

```bash
# ─── Iniciar (BD se dockeriza e inicializa automáticamente) ───
docker compose -p controlstock-prod --profile prod up --build -d

# ─── Detener ───
docker compose -p controlstock-prod down

# ─── Detener y eliminar volúmenes (⚠️ borra datos de BD) ───
docker compose -p controlstock-prod down -v
```

---

## 6. Estructura Final de Archivos

```
ControlStock/
├── .dockerignore
├── docker-compose.yml               ← Orquestación (dev + prod)
├── docker_docs/
│   └── DOCKER_DEV_GUIDE.md
│   └── DOCKER_PROD_GUIDE.md
│   └── DOCKER_GETTING_STARTED.md
│
├── backend/controlstock/
│   ├── .dockerignore
│   ├── Dockerfile                   ← builder → final (unica imagen)
│   ├── pom.xml
│   └── src/
│
├── frontend/
│   ├── .dockerignore
│   ├── Dockerfile                   ← deps → build → final (unica imagen)
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│
└── database/
    ├── 1-create_tables.sql
    └── 2-seed_data.sql
```

---

## 7. Resumen de Cambios Realizados

| Cambio | Descripción |
|--------|-------------|
| ❌ **Eliminados perfiles dev/prod** | Un solo Dockerfile, una sola imagen para cada servicio |
| ❌ **Eliminados bind volumes** | Código incluido en la imagen (self-contained) |
| ❌ **Eliminados DevTools/JDWP** | Innecesarios sin bind mounts |
| ❌ **Eliminado HMR** | Reemplazado por Nginx en ambos entornos |
| 🔧 **Frontend en Nginx siempre** | Tanto dev como prod usan Nginx para servir la SPA |
| 🌐 **Alias de red "backend"** | Nginx resuelve el backend por nombre en cualquier red |