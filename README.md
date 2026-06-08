# ControlStock

## 👥 Equipo — Grupo 5

| Nombre | Carnet |
|--------|--------|
| Kevin Roberto Gomez Tobar | GT24002 |
| Rafael Armando Ibañez Diego | ID24001 |
| Yohalmo Alonso Castro Siguenza | CS24009 |
| Brayan Alexander Villalta Gutierrez | VG24003 |
| Mynor Ivan Carias Martinez | CM23138 |

---

### 🗄️ Base de datos

Los scripts SQL están en la carpeta [`database/`](database/):

- `1-create_tables.sql` — Creación de tablas
- `2-seed_data.sql` — Datos de ejemplo
- [`DB_README.md`](database/DB_README.md) — Instrucciones básicas para recrear la BD

## 🐳 Cómo ejecutar el proyecto con Docker

Solo necesitas **Docker Desktop** instalado.

[Guía de instalacion Docker en Windows](https://learn.microsoft.com/es-es/virtualization/windowscontainers/manage-docker/configure-docker-daemon)
<br/>
[Guía de instalacion Docker en Linux](https://docs.docker.com/engine/install/ubuntu/)



### Opción 1: Desarrollo con BD local

Esta opción sirve con PostgreSQL instalado o una imagen docker previa para tu base de datos PostgreSQL.


#### 1. Prepara tu base de datos local

Pasos detallados para recrear la base de datos de PostgreSQL e inicializar los scripts con la carga semilla de datos iniciales.
* **Archivo:** [DB_README.md](database/DB_README.md)


### ⚙️ ¿Dónde configurar los datos de tu base de datos local?

Los datos de conexión se configuran en el archivo **`docker-compose.yml`**, en la sección `backend-dev` > `environment`:

```yaml
backend-dev:
  environment:
    SPRING_DATASOURCE_URL: jdbc:postgresql://host.docker.internal:5432/controlstockdb
    SPRING_DATASOURCE_USERNAME: admin
    SPRING_DATASOURCE_PASSWORD: admin123
```

Cambia `controlstockdb`, `admin` y `admin123` por los valores de tu base de datos local.

> **Nota Importante:**  
> Estos cambios no deben subir a GitHub, ya que son configuraciones locales de cada usuario.

---

#### 2. Levanta backend y frontend

```bash
docker compose -p controlstock-dev --profile dev up --build
```

| Servicio | URL |
|----------|-----|
| 🌐 Frontend | [http://localhost:5173](http://localhost:5173) |
| 🔌 Backend (API) | [http://localhost:8080](http://localhost:8080) |

---

### Opción 2: Todo con Docker (simulación de producción)

Un solo comando levanta **base de datos + backend + frontend**:

```bash
docker compose -p controlstock-prod --profile prod up --build -d
```

| Servicio | URL |
|----------|-----|
| 🌐 Frontend | [http://localhost](http://localhost) |
| 🔌 Backend (API) | [http://localhost:8081](http://localhost:8081) |
| 🗄️ PostgreSQL | `localhost:5434` — usuario: `admin_prod` / contraseña: `admin_production_password` |

Para detenerlo:

```bash
docker compose -p controlstock-prod down
```

---

### 📖 Guía detallada

Si quieres entender cómo funciona Docker en este proyecto, revisa:

👉 [GUIA_DOCKER.md](docker_docs/GUIA_DOCKER.md)

---

