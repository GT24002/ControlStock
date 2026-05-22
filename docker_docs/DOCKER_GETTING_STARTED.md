# 🚀 Guía de Inicio Rápido para Desarrolladores

> **ControlStock con Docker + IntelliJ + VSCode**  
> *Dos modos de trabajo: elige al que mejor te adaptes.*

---

## 📋 Los Dos Modos de Trabajo

| Modo | PostgreSQL | Backend | Frontend |
|------|-----------|---------|----------|
| **🌓 HÍBRIDO** (recomendado) | Docker | IntelliJ | VS Code `npm run dev` |
| **🐳 TODO-EN-DOCKER** (full) | Docker | Docker | Docker |

Ambos modos comparten la misma base de datos PostgreSQL en Docker.  
**Tú decides cómo ejecutar el backend y frontend.**

---

# 🌓 MODO HÍBRIDO (Recomendado)

> PostgreSQL en Docker + Backend en IntelliJ + Frontend con VS Code `npm run dev`  
> *Sin necesidad de saber Docker — solo editas y guardas como siempre.*

---

## 📋 Prerrequisitos

| Herramienta | Versión Mínima | ¿Para qué? |
|-------------|---------------|------------|
| **Docker Desktop** | 4.x+ | Solo para PostgreSQL |
| **IntelliJ IDEA** (Ultimate o Community) | 2024.x+ | Backend Java + Spring Boot |
| **Node.js** | 20.x+ | Frontend React/Vite |
| **VSCode** | 1.90+ | Frontend (opcional, editor alternativo) |
| **Git** | 2.40+ | Clonar repositorio |

**⚠️ Windows**: Docker Desktop debe usar **WSL2 backend**.
[Guia de instalacion WSL2](https://learn.microsoft.com/es-es/windows/wsl/install)


---

## Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/GT24002/ControlStock.git
cd ControlStock
```

Estructura del proyecto:

```
ControlStock/
├── docker-compose.yml
├── GETTING_STARTED.md
├── backend/controlstock/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/resources/
│       ├── application.properties        ← Base (PostgreSQL en Docker)
│       └── application-local.properties  ← Perfil "local" (opcional)
├── frontend/controlstock/
│   ├── Dockerfile
│   ├── vite.config.ts
│   └── src/
└── database/
    ├── 1-create_tables.sql
    └── 2-seed_data.sql
```

---

## Paso 2: Levantar SOLO PostgreSQL

```bash
# ─── Único comando necesario ───
docker compose -p controlstock-dev up db-dev -d
```

**¿Qué hace?**
1. Descarga la imagen de PostgreSQL 16.13 (solo la primera vez)
2. Crea la base de datos `controlstock` con usuario `admin`/`admin123`
3. Ejecuta los scripts SQL de `database/` para crear tablas y datos iniciales
4. PostgreSQL queda disponible en `localhost:5433`

**Verificar que funciona:**
```bash
docker compose -p controlstock-dev ps
# Name                    Status
# controlstock-db-dev     Up (healthy)
```

---

## Paso 3: Backend desde IntelliJ

### 3.1 Abrir el proyecto
```
File → Open → Seleccionar ControlStock/backend/controlstock/
```

### 3.2 (Opcional) Configurar perfil "local"
Las credenciales en `application.properties` ya apuntan a PostgreSQL en Docker por defecto, pero si prefieres un perfil separado:

1. `Run → Edit Configurations`
2. Click `+` → `Application`
3. Configurar:

| Campo | Valor |
|-------|-------|
| Main class | `com.ues.controlstock.ControlstockApplication` |
| Module | `controlstock` |
| Active Profiles | `local` (opcional) |
| Working directory | `ControlStock/backend/controlstock` |
| JDK | `21` (corregir si no aparece) |

4. Click `Apply → OK`

> [!NOTE]
> **💡 Entendiendo las dos configuraciones del Backend:**
> * **`application.properties` (Base / Docker):** Contiene la configuración global. Cuando ejecutas en **Modo Todo-en-Docker**, el contenedor del backend no puede acceder a la base de datos usando `localhost`. Por ello, `docker-compose.yml` sobrescribe dinámicamente las propiedades usando variables de entorno para apuntar al servicio **`db-dev:5433`**.
> * **`application-local.properties` (Perfil `local` / IDE):** Se activa al pasar el perfil `local` en tu IDE. Está diseñado para el **Modo Híbrido**, permitiendo que tu backend (corriendo fuera de Docker) acceda a la base de datos expuesta en **`localhost:5433`** y activando automáticamente **Spring DevTools** para la recarga rápida de clases en desarrollo.

### 3.3 Habilitar compilación automática (Hot Reload)
```
Settings → Build, Execution, Deployment → Compiler
✅ "Build project automatically"
```

```
Settings → Advanced Settings
✅ "Allow auto-make to start even if development application is currently running"
```

### 3.4 Ejecutar el proyecto
- Click ▶️ (Run) en la esquina superior derecha
- O haz clic derecho en la clase principal → `Run`

**Verificar**: La consola debe mostrar:
```
Started Application in 3.456 seconds
```

Y la API Swagger en: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## Paso 4: Frontend con npm run dev

### 4.1 Abrir terminal en el frontend
```bash
cd frontend/controlstock
```

### 4.2 Instalar dependencias (solo la primera vez)
```bash
npm install
```

### 4.3 Iniciar servidor de desarrollo
```bash
npm run dev
```

**Verificar**: Debes ver:
```
➜  Local:   http://localhost:5173/
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## ✅ Resumen del Modo Híbrido

```
┌──────────────────────────────────────────────────┐
│                 TU MÁQUINA LOCAL                  │
├──────────────────────────────────────────────────┤
│                                                   │
│  ┌──────────────┐     ┌──────────────┐           │
│  │  IntelliJ    │     │   Terminal   │           │
│  │  Backend     │     │  npm run dev │           │
│  │  :8080       │     │  :5173       │           │
│  └──────┬───────┘     └──────┬───────┘           │
│         │                     │                   │
│         └──────┬──────────────┘                   │
│                │                                  │
│         ┌──────▼───────┐                          │
│         │   Docker     │                          │
│         │ PostgreSQL   │                          │
│         │  localhost:5433                         │
│         └──────────────┘                          │
└──────────────────────────────────────────────────┘

Comandos:
  docker compose -p controlstock-dev up db-dev -d  ← Inicia BD
  [IntelliJ] ▶️ Run                                 ← Inicia Backend
  npm run dev                                       ← Inicia Frontend
  docker compose -p controlstock-dev down           ← Detiene BD
```

---

# 🐳 MODO TODO-EN-DOCKER (Avanzado)

> Todo corre en contenedores. Para desarrolladores que conocen Docker.  
> *Un solo comando levanta todo.*

```bash
docker compose -p controlstock-dev --profile dev up --build
```

Este modo activa los servicios `backend-dev`, `frontend-dev` y `db-dev` del perfil `dev`.  
Sin el perfil, `docker compose up` solo levanta PostgreSQL.

**Documentación completa del modo Docker**: [docker-dev-setup.md](./docker-dev-setup.md)

---

# 🔧 Flujo de Trabajo Diario


```bash
cd ControlStock

# 1. Traer cambios, actualizar tu rama con los cambios de main

# 2. Iniciar PostgreSQL (si no está corriendo)
docker compose -p controlstock-dev up db-dev -d

# 3. Backend → IntelliJ ▶️
# 4. Frontend → npm run dev
```

### "Necesito ver logs de PostgreSQL"
```bash
docker compose -p controlstock-dev logs -f db-dev
```

### "Necesito resetear la base de datos"
```bash
# ⚠️ Borra TODOS los datos
docker compose -p controlstock-dev down -v
docker compose -p controlstock-dev up db-dev -d
```

### "Necesito instalar una dependencia npm"
```bash
# En el frontend (NO dentro del contenedor)
cd frontend/controlstock
npm install axios
```

### "Necesito ejecutar tests de Java"
```bash
# Desde IntelliJ: Click derecho sobre el test → Run
# O desde terminal:
cd backend/controlstock
mvn test
```

### "Necesito acceder a la BD directamente"
```bash
docker compose -p controlstock-dev exec db-dev psql -U admin -d controlstock
```

### "Terminé mi jornada"
```bash
# Detener PostgreSQL y conserva datos
docker compose -p controlstock-dev down

# Para liberar espacio:
docker system prune
```

---

# ⚠️ Solución de Problemas

### 🔴 "Port 5433 is already in use"
**Causa**: Tienes PostgreSQL instalado localmente.
```bash
# Windows:
net stop postgresql-x64-16
```

### 🔴 "Backend no conecta a PostgreSQL"
1. Verifica que PostgreSQL esté corriendo: `docker compose -p controlstock-dev ps`
2. Verifica el estado: `docker compose -p controlstock-dev logs db-dev`
3. Espera el healthcheck: `db-dev` debe mostrar `Up (healthy)`
4. En IntelliJ, verifica `application.properties` apunta a `localhost:5433`

### 🔴 "Frontend: npm install falla"
```bash
# Limpiar caché y reintentar
rm -rf node_modules package-lock.json
npm install
```

### 🔴 "Vite: HMR no funciona"
Verifica en el navegador (F12 → Console):
- Debe aparecer: `[vite] connected.`

Si no aparece, en `vite.config.ts` asegúrate de tener:
```typescript
server: {
  host: "0.0.0.0",     // solo para modo Docker
  port: 5173,
  hmr: {
    host: "localhost",
    port: 5173,
    protocol: "ws"
  }
}
```

---

# 📊 Comparativa: ¿Qué modo elegir?

**Recomendación**: Usa el **Modo Híbrido** para el día a día.  
El **Modo Todo-en-Docker** es ideal para practicar CI/CD o, cuando quieres un entorno completamente aislado y asegurar que un despliegue funcione igual que en producción.

---
