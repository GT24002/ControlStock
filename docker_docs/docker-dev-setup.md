# Dockerización de ControlStock

> **Documentación Técnica** — Arquitectura de Contenedores con Hot Reload  
> *Stack: PostgreSQL 16.13 || Spring Boot 3 + Java 21 || React + Vite + TypeScript*

---

## 1. Arquitectura General

El sistema se compone de **tres servicios** interconectados mediante una red Docker bridge personalizada (`controlstock_network`):

```
┌─────────────────────────────────────────────────────────┐
│                    docker-compose.yml                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐     ┌──────────────┐     ┌────────┐  │
│  │   Frontend   │     │   Backend    │     │   DB   │  │
│  │  React/Vite  │────▶│ Spring Boot  │────▶│Postgres│  │
│  │  :5173       │     │  :8080       │     │ :5432  │  │
│  └──────────────┘     └──────────────┘     └────────┘  │
│       │                      │                 │        │
│       ▼                      ▼                 ▼        │
│  Bind Mount            Bind Mount           Named      │
│  + anon vol           + Maven cache        Volume     │
│  (HMR listo)          (DevTools listo)    (persist.)  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Configuración Aplicada por Servicio

### 2.1 PostgreSQL (`postgres:16.13-alpine3.23`)

| Elemento | Configuración |
|----------|--------------|
| **Imagen** | `postgres:16.13-alpine3.23` |
| **Puerto** | `5432:5432` |
| **Persistencia** | `Named Volume` → `controlstock_pgdata:/var/lib/postgresql/data` |
| **Inicialización** | Bind mount `./database:/docker-entrypoint-initdb.d:ro` |
| **Healthcheck** | `pg_isready` cada 10s, 5 reintentos, timeout 5s, start_period 15s |
| **Red** | `controlstock-net`,

**¿Qué se logra?**  
- Los datos sobreviven a `docker compose down` porque el **Named Volume** almacena los datos en el área gestionada por Docker (`/var/lib/docker/volumes/`).
- Los scripts SQL de `./database/` se ejecutan **solo la primera vez** que el contenedor arranca con un volumen vacío (no se re-ejecutan si ya hay datos).
- El healthcheck garantiza que el backend no intente conectarse hasta que PostgreSQL esté listo para aceptar conexiones.

### 2.2 Backend Spring Boot (`eclipse-temurin:21.0.11_10-jre-jammy`)

| Elemento | Configuración |
|----------|--------------|
| **Build** | Multi-stage: `builder` (Maven compila) → `dev` (JRE ejecuta con DevTools) |
| **Puertos** | `8080` (app), `5005` (JDWP), `35729` (LiveReload) |
| **Volumen código** | Bind mount `./backend/controlstock:/app` |
| **Caché Maven** | Named Volume `controlstock_m2_cache:/root/.m2` |
| **DevTools** | `restart.enabled=true`, `livereload.enabled=true`, `restart.additional-paths=/app/src` |
| **JDWP** | `address=*:5005`, `suspend=n` |

**¿Qué se logra?**  
- **Hot Reload en Java**: Spring Boot DevTools monitorea el classpath. Cuando se monta el código fuente como bind mount y se compila (manualmente o con el IDE), DevTools detecta los cambios y reinicia el contexto de la aplicación (no todo el JVM), logrando recargas en **~1-3 segundos**.
- **Depuración remota**: El puerto 5005 expone JDWP, permitiendo conectar IntelliJ/VSCode para debuggear el código dentro del contenedor.
- **Caché de Maven persistente**: Las dependencias descargadas no se pierden al reconstruir la imagen, ahorrando ~5-10 minutos en cada rebuild.

### 2.3 Frontend React + Vite (`node:current-alpine3.23`)

| Elemento | Configuración |
|----------|--------------|
| **Build** | Multi-stage: `deps` (npm ci) → `dev` (Vite server) |
| **Puerto** | `5173:5173` |
| **Volumen código** | Bind mount `./frontend/controlstock:/app` |
| **Volumen anónimo** | `/app/node_modules` |
| **Vite flags** | `--host 0.0.0.0 --port 5173` |
| **Polling forzado** | `CHOKIDAR_USEPOLLING=1`, `CHOKIDAR_INTERVAL=1000` |
| **HMR config** | `hmr.host=localhost`, `hmr.protocol=ws`, `watch.usePolling=true` |

**¿Qué se logra?**  
- **Hot Module Replacement (HMR)**: Al editar un archivo `.tsx` en el host, Vite detecta el cambio y reemplaza **solo el módulo modificado** en el navegador, sin recargar la página completa. La experiencia es instantánea (~50-200ms de latencia).
- **Protección de node_modules**: El volumen anónimo `/app/node_modules` evita que el bind mount del código sobrescriba los `node_modules` del contenedor con los del host (que podrían ser diferentes o inexistentes).
- **Polling como fallback**: Los sistemas de archivos montados en Docker Desktop (especialmente en Windows y Mac) no disparan eventos nativos de `inotify`. El polling fuerza a Vite a verificar cambios periódicamente.

---

## 3. Sustento Técnico de Decisiones (EL "PORQUÉ")

### 3.1 ¿Por qué Named Volume para PostgreSQL y no Bind Mount?

| Aspecto | Named Volume | Bind Mount (`./data:/var/lib/...`) |
|---------|-------------|-----------------------------------|
| **Rendimiento** | ✅ Nativo, sin overhead de traducción de rutas | ❌ 30-50% más lento en Windows/Mac (traducción entre sistemas de archivos host ↔ contenedor) |
| **Portabilidad** | ✅ Funciona idéntico en Windows, Mac y Linux | ❌ Las rutas absolutas/relativas varían por SO |
| **Integridad** | ✅ Docker gestiona el ciclo de vida | ❌ Riesgo de corrupción si el host modifica archivos binarios de Postgres |
| **Backup** | ✅ `docker run --rm -v pgdata:/data alpine tar czf backup.tar.gz /data` | ❌ Requiere scripts manuales |
| **Permisos** | ✅ Postgres controla permisos (uid 70) | ❌ Pueden haber conflictos de propietario con el usuario del host |

**Conclusión**: El **Named Volume** es la opción recomendada por Docker oficial y por la comunidad de PostgreSQL. El bind mount se usa **solo** para los scripts de inicialización (`./database/`) porque son archivos de texto planos que el usuario necesita versionar y modificar.

### 3.2 ¿Por qué Bind Mount para el código fuente + Volumen anónimo para node_modules?

**Bind Mount del código fuente (`./frontend:/app`)**  
- Permite que los cambios hechos en el editor (VSCode, IntelliJ) sean visibles **instantáneamente** dentro del contenedor, sin necesidad de reconstruir la imagen.
- El flujo de trabajo es: *Editar → Guardar → Ver cambio en el navegador* (HMR) o *Editar → Guardar → Ver cambio en consola* (DevTools). Sin bind mount, cada cambio requeriría un `docker build --no-cache`.

**Volumen anónimo (`/app/node_modules`)**  
- Cuando se monta un bind mount de un directorio del host al contenedor, el contenido del host **reemplaza** completamente el contenido del destino en el contenedor.  
- Si el host no tiene `node_modules` (porque `npm install` nunca se ejecutó en el host, o tiene una versión diferente), el bind mount **borraría** los `node_modules` que se instalaron durante `docker build`.
- El volumen anónimo **se monta después** del bind mount (por orden en `docker-compose.yml`), y prevalece sobre él para esa ruta específica, preservando los `node_modules` del contenedor.

**Analogía**:  
```
Bind mount:  /host/codigo  ──monta──▶ /app (en el contenedor)
Anon vol:    /docker/nodes_modules ──monta──▶ /app/node_modules (prevalece)
```
El resultado es que `/app/src`, `/app/public`, etc. vienen del host, pero `/app/node_modules` viene del contenedor.

### 3.3 ¿Por qué activar `usePolling` en Vite?

**El problema**:  
Vite (y la mayoría de las herramientas de desarrollo) usan **eventos del sistema de archivos** (inotify en Linux, FSEvents en Mac, ReadDirectoryChanges en Windows) para detectar cambios. Estos eventos funcionan correctamente cuando el proceso y los archivos están en el **mismo sistema de archivos nativo**.

**En Docker Desktop (Windows/Mac)**:  
El bind mount utiliza **gRPC FUSE** (Mac) o **9p** (Windows WSL2) para traducir operaciones de archivos entre el host y la VM de Linux donde corre Docker. Estos protocolos **no propagan eventos de sistema de archivos** de forma confiable. Como resultado, Vite nunca se entera de que un archivo cambió, y el HMR no funciona.

**La solución (`usePolling: true`)**:  
- En lugar de esperar eventos nativos, Vite lee el estado del archivo cada N milisegundos (por defecto 1000ms).
- Compara el timestamp de modificación actual con el anterior.
- Si detecta un cambio, dispara el HMR correspondiente.
- **Trade-off**: Mayor uso de CPU (un hilo adicional leyendo archivos cada 1s). En equipos modernos el impacto es marginal (~1-2% de CPU).

**Configuración óptima**:  
```typescript
watch: {
  usePolling: true,
  interval: 1000  // 1 segundo entre verificaciones
}
```
Un intervalo menor (ej. 300ms) hace el HMR más reactivo pero consume más CPU.  
Un intervalo mayor (ej. 2000ms) ahorra CPU pero introduce latencia perceptible.

### 3.4 ¿Por qué "Build project automatically" en el IDE para Spring Boot?

**El ecosistema**:  
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
   │                        │
   │                   Reinicia contexto
   │                   (~2-3s)
   │                        │
   │  ←────────────────  App lista
```

**Flujo detallado**:  
1. El desarrollador guarda un archivo `.java` en el IDE.
2. **"Build project automatically"** (IntelliJ) o **Auto Save → Build** (VSCode Java extension) compila automáticamente el `.java` a `.class`.
3. Los `.class` compilados se escriben en `target/classes/` dentro del proyecto (por ejemplo, `backend/controlstock/target/classes/com/...`).
4. El bind mount `./backend/controlstock:/app` hace que `target/` esté disponible dentro del contenedor en `/app/target/`.
5. Spring Boot DevTools usa **dos classloaders**: uno para dependencias (que no cambia) y otro para las clases de la aplicación (que se reinicia).
6. DevTools detecta el nuevo `.class` en `/app/target/classes/`, termina el classloader de la aplicación, crea uno nuevo, y recarga el contexto.
7. El resultado es un **reinicio parcial** (no de toda la JVM) que toma ~2-3 segundos, versus un `docker compose restart` que tomaría ~20-30 segundos.

**¿Por qué es necesario?**  
- Sin compilación automática del IDE, los cambios en `.java` nunca producen nuevos `.class`, y DevTools no tiene nada que detectar.
- El desarrollador tendría que compilar manualmente (`mvn compile`) después de cada cambio, lo cual rompe el flujo ágil.
- La compilación manual también descartaría la ventaja de la recarga parcial de DevTools.

---

## 4. Comandos de Uso Diario

```bash
# ─── Iniciar el entorno de desarrollo ───
docker compose up --build

# ─── Ver logs de un servicio específico ───
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# ─── Ejecutar comandos Maven dentro del contenedor ───
docker compose exec backend mvn compile
docker compose exec backend mvn test

# ─── Ejecutar comandos npm dentro del contenedor ───
docker compose exec frontend npm install axios
docker compose exec frontend npm run build

# ─── Acceder a la consola de PostgreSQL ───
docker compose exec db psql -U admin -d controlstock

# ─── Detener servicios (conserva datos y volúmenes) ───
docker compose down

# ─── Detener y eliminar volúmenes (⚠️ borra datos de BD) ───
docker compose down -v

# ─── Reconstruir sin caché ───
docker compose build --no-cache
docker compose up
```

---

## 5. Estructura Final de Archivos

```
ControlStock/
├── docker-compose.yml              ← Orquestación de 3 servicios
├── docker-dev-setup.md             ← Esta documentación
│
├── backend/controlstock/
│   ├── Dockerfile                  ← Multi-stage: builder → dev → prod
│   ├── pom.xml                     ← Ya incluye spring-boot-devtools
│   └── src/                        ← Código fuente (bind mount)
│
├── frontend/controlstock/
│   ├── Dockerfile                  ← Multi-stage: deps → dev → build → prod
│   ├── vite.config.ts              ← Actualizado con usePolling + HMR
│   └── src/                        ← Código fuente (bind mount)
│
└── database/
    ├── 1-create_tables.sql         ← Scripts de inicialización
    ├── 2-seed_data.sql
    └── ...
```

---

## 6. Resumen de Buenas Prácticas Implementadas

| Práctica | Beneficio |
|----------|-----------|
| **Multi-stage build** | Imágenes más pequeñas (dev vs prod), separación de responsabilidades |
| **Named Volume para BD** | Rendimiento nativo, portabilidad, integridad de datos |
| **Bind mount + anon volume (frontend)** | HMR funcional sin sobrescribir node_modules |
| **usePolling en Vite** | HMR funciona en Docker Desktop (Windows/Mac) |
| **DevTools + compilación automática** | Hot Reload en Java ~2s |
| **Healthcheck en PostgreSQL** | Arranque ordenado sin race conditions |
| **Caché de Maven persistente** | Builds rápidos en iteraciones |
| **Red bridge personalizada** | Aislamiento y resolución DNS por nombre de servicio |
| **JDWP expuesto** | Depuración remota desde el IDE |
| **Scripts SQL versionados** | Inicialización reproducible de la BD |