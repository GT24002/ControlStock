# 🚀 Guía de Inicio Rápido para Desarrolladores

> **ControlStock con Docker**  
> *Dos modos de trabajo: elige al que mejor te adaptes.*

---

## 📋 Los Dos Modos de Trabajo

| Modo | PostgreSQL | Backend | Frontend |
|------|-----------|---------|----------|
| **🐳 DESARROLLO** | **Externa local** (no Docker) | Docker | Docker (Nginx) |
| **🚀 PRODUCCIÓN** | Docker (inicializada automáticamente) | Docker (Alpine optimizado) | Docker (Nginx) |

---

# 🐳 MODO DESARROLLO

## Prerrequisito: PostgreSQL local

El backend en modo desarrollo se conecta a una base de datos PostgreSQL **externa local** (en tu máquina host).

### Windows:
1. Descargar e instalar PostgreSQL 16 desde [postgresql.org](https://www.postgresql.org/download/windows/)
2. Durante la instalación, configura el usuario `postgres` con contraseña
3. Abre `SQL Shell (psql)` o cmd y ejecuta:
```bash
psql -U postgres -c "CREATE DATABASE controlstock;"
psql -U postgres -c "CREATE USER admin WITH PASSWORD 'admin123';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE controlstock TO admin;"
psql -U admin -d controlstock -f database/1-create_tables.sql
psql -U admin -d controlstock -f database/2-seed_data.sql
```

### Linux/Mac:
```bash
sudo -u postgres psql -c "CREATE DATABASE controlstock;"
sudo -u postgres psql -c "CREATE USER admin WITH PASSWORD 'admin123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE controlstock TO admin;"
psql -U admin -d controlstock -f database/1-create_tables.sql
psql -U admin -d controlstock -f database/2-seed_data.sql
```

## Ejecutar el entorno de desarrollo

```bash
# Requisito: PostgreSQL corriendo localmente en puerto 5432
# con BD 'controlstock', usuario 'admin', contraseña 'admin123'

docker compose -p controlstock-dev --profile dev up --build
```

Esto levanta:
- **backend-dev**: Spring Boot en `localhost:8080`
- **frontend-dev**: React compilado servido por Nginx en `localhost:5173`

**Documentación completa**: [DOCKER_DEV_GUIDE.md](./DOCKER_DEV_GUIDE.md)

---

# 🚀 MODO PRODUCCIÓN

```bash
docker compose -p controlstock-prod --profile prod up --build -d
```

Este modo dockeriza TODO, incluyendo PostgreSQL, que se inicializa automáticamente con los scripts SQL de `database/`.

- **db-prod**: PostgreSQL en `localhost:5434`
- **backend-prod**: Spring Boot optimizado en `localhost:8081`
- **frontend-prod**: Nginx sirviendo la SPA en `localhost:80`

**Documentación completa**: [DOCKER_PROD_GUIDE.md](./DOCKER_PROD_GUIDE.md)

---

# 🔧 Flujo de Trabajo Diario

```bash
cd ControlStock

# 1. Asegúrate que PostgreSQL local esté corriendo
#    (postgresql service, o pg_ctl start)

# 2. Iniciar todo el entorno de desarrollo
docker compose -p controlstock-dev --profile dev up --build

# 3. Desarrollo: editar código → reconstruir imagen
docker compose -p controlstock-dev --profile dev up --build
```

**Nota**: Tanto backend como frontend usan la **misma imagen** en desarrollo y producción. La única diferencia es la configuración (variables de entorno y ARG build).

### "Necesito ver logs de desarrollo"
```bash
docker compose -p controlstock-dev logs -f backend-dev
docker compose -p controlstock-dev logs -f frontend-dev
```

### "Necesito instalar una dependencia npm"
```bash
cd frontend
npm install axios
# Luego reconstruir la imagen:
docker compose -p controlstock-dev --profile dev up --build
```

### "Necesito ejecutar tests de Java"
```bash
cd backend/controlstock
mvn test
```

### "Terminé mi jornada"
```bash
# Detener servicios de desarrollo
docker compose -p controlstock-dev down
```

---

# ⚠️ Solución de Problemas

### 🔴 "Backend no conecta a PostgreSQL"
1. Verifica que PostgreSQL esté corriendo localmente en `localhost:5432`
2. Verifica que la BD `controlstock` y el usuario `admin` existan
3. Verifica logs: `docker compose -p controlstock-dev logs backend-dev`

### 🔴 "Port 5173/8080/5434 already in use"
```bash
# Detener cualquier proceso usando esos puertos
netstat -ano | findstr :5173
```

### 🔴 "Frontend: npm compilacion falla al construir"
```bash
# Forzar reconstrucción sin caché
docker compose -p controlstock-dev build --no-cache frontend-dev
docker compose -p controlstock-dev --profile dev up
```

---

# 📊 ¿Qué modo elegir?

**Recomendación**: Usa el **Modo Desarrollo** para el día a día.  
El **Modo Producción** para simular un despliegue real con BD dockerizada e inicialización automática.

---