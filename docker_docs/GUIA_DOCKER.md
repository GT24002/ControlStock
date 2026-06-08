# 🐳 Guía Docker de ControlStock

> Una guía sencilla para entender cómo funciona Docker en este proyecto.

---

## 📋 Resumen

El proyecto tiene **dos formas de ejecutarse**:

| Modo | Base de datos | Backend | Frontend | ¿Para qué? |
|------|:-------------:|:-------:|:--------:|------------|
| **Producción** 🚀 | En Docker | En Docker | En Docker | Probar todo el sistema sin instalar nada |
| **Desarrollo** 🛠️ | En tu PC local | En Docker | En Docker | Programar y hacer cambios con tu BD local |

---

## 🚀 Modo Producción (todo en Docker)

Un solo comando levanta todo:

```bash
docker compose -p controlstock-prod --profile prod up --build -d
```

- PostgreSQL se inicia solo, no necesitas hacer nada
- Los scripts SQL se ejecutan automáticamente
- Frontend servido por Nginx (rápido y optimizado)

| Servicio | URL |
|----------|-----|
| Frontend | [http://localhost](http://localhost) |
| Backend API | [http://localhost:8081](http://localhost:8081) |
| PostgreSQL | `localhost:5434` — usuario: `admin_prod` / contraseña: `admin_production_password` |

```bash
# Detener
docker compose -p controlstock-prod down

# Detener y borrar datos (⚠️ cuidado: pierdes la BD)
docker compose -p controlstock-prod down -v
```

---

## 🛠️ Modo Desarrollo (BD local)

Backend y frontend van en Docker, pero tú manejas tu propia base de datos PostgreSQL.

### Levanta el entorno

```bash
docker compose -p controlstock-dev --profile dev up --build
```

| Servicio | URL |
|----------|-----|
| Frontend | [http://localhost:5173](http://localhost:5173) |
| Backend API | [http://localhost:8080](http://localhost:8080) |

```bash
# Detener
docker compose -p controlstock-dev down
```

---

## ⚙️ ¿Dónde cambiar la configuración de la BD?

Abre **`docker-compose.yml`** y busca la sección `backend-dev` > `environment`:

```yaml
SPRING_DATASOURCE_URL: jdbc:postgresql://host.docker.internal:5432/controlstockdb
SPRING_DATASOURCE_USERNAME: admin
SPRING_DATASOURCE_PASSWORD: admin123
```

Cambia `controlstockdb`, `admin` y `admin123` por los datos de tu base de datos local.

> `host.docker.internal` es una dirección especial que Docker usa para acceder a servicios que están en tu PC (no dentro de Docker).

---

## 🔧 Comandos útiles

```bash
# Ver logs del backend
docker compose -p controlstock-dev logs backend-dev

# Ver logs del frontend
docker compose -p controlstock-dev logs frontend-dev

# Reconstruir desde cero (sin caché)
docker compose -p controlstock-dev build --no-cache frontend-dev
docker compose -p controlstock-dev up --build
```

---

## 💡 ¿Cómo funciona internamente?

### Backend (Spring Boot + Java 21)
- Se compila con Maven dentro del contenedor (multi-stage build)
- La imagen final usa una versión ligera de Java (Alpine)
- Se conecta a la BD según las variables de entorno que le pases

### Frontend (React + Vite + TypeScript)
- Se compila con npm dentro del contenedor
- La imagen final usa **Nginx** para servir los archivos estáticos
- Las peticiones a `/api/*` Nginx las redirige automáticamente al backend (proxy reverso), evitando problemas de CORS

### Base de datos (PostgreSQL 16)
- En **modo producción** se crea sola con los scripts de `database/`
- En **modo desarrollo** tú la administras en tu PC

---

## 📁 Estructura de archivos relevante

```
ControlStock/
├── docker-compose.yml          ← Configuración de los servicios
├── docker_docs/
│   └── GUIA_DOCKER.md          ← Esta guía
├── backend/controlstock/
│   └── Dockerfile              ← Cómo se construye la imagen del backend
├── frontend/
│   ├── Dockerfile              ← Cómo se construye la imagen del frontend
│   └── nginx.conf              ← Configuración de Nginx
└── database/
    ├── 1-create_tables.sql     ← Creación de tablas
    └── 2-seed_data.sql         ← Datos de ejemplo