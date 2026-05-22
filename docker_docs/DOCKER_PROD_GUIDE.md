# Guía de Contenedores en Producción (Simulación)

Esta documentación técnica explica cómo simular y entender un entorno de **producción real** en una máquina local utilizando **Docker Compose** con el perfil `prod` y la estrategia de **Multi-stage Builds** (Construcción Multietapa) implementada en el proyecto.

---

## 1. Arquitectura de Producción vs Desarrollo

En desarrollo utilizamos herramientas para la comodidad como programadores (reinicio rápido, compiladores y depuración). En producción, eliminamos todo el "ruido" para lograr la máxima velocidad, seguridad y ligereza.

```
                  ENTORNO DE PRODUCCIÓN (perfil prod)
             ┌──────────────────────────────────────────────────────────┐
             │ Tu Computadora / Servidor Cloud                          │
             │                                                          │
             │      Navegador Web (Usuario)                             │
             │             │                                            │
             │             ▼ Puerto 80 (HTTP)                           │
             │     ┌───────────────┐                                    │
             │     │    Nginx      │ (Sirve HTML/JS estático)           │
             │     │  (Frontend)   │                                    │
             │     └───────┬───────┘                                    │
             │             │                                            │
             │             │ /api/ (Proxy Reverso Interno)              │
             │             ▼                                            │
             │     ┌───────────────┐          ┌───────────────┐         │
             │     │ Spring Boot   │─────────▶│  PostgreSQL   │         │
             │     │   (Backend)   │          │ (Base Datos)  │         │
             │     │  Puerto 8080  │          │  Puerto 5432  │         │
             │     └───────────────┘          └───────────────┘         │
             │         (Sin JRE)                 (Volumen Prod)         │
             └──────────────────────────────────────────────────────────┘
```

---

## 2. Diferencia con el Entorno de Desarrollo

### Perfiles en docker-compose.yml

El archivo `docker-compose.yml` unifica ambos entornos mediante perfiles:

| Perfil | Nombre de Proyecto | Servicios | Uso |
|--------|-------------------|-----------|-----|
| `dev` | `controlstock-dev` | `db-dev`, `backend-dev`, `frontend-dev` | Desarrollo con Hot Reload |
| `prod` | `controlstock-prod` | `db-prod`, `backend-prod`, `frontend-prod` | Producción simulada |

### Características del perfil `prod`:

* **`target: prod`**: Indica a Docker que compile las imágenes usando únicamente las etapas finales (`prod`) definidas en los `Dockerfile`.
* **Sin Bind Mounts**: Ya no vincula carpetas locales de código. Si se cambia un archivo en el editor local, no se reflejará dentro del contenedor hasta que se vuelva a compilar. Esto garantiza la inmutabilidad y seguridad del contenedor.
* **Red y Volúmenes Aislados**: Usa la red `controlstock_network_prod` y el volumen de base de datos `controlstock_pgdata_prod` para evitar sobrescribir los datos de desarrollo local.
* **Validación de Base de Datos**: El backend usa `SPRING_JPA_HIBERNATE_DDL_AUTO: update` para mantener sincronizada la base de datos.

### frontend/controlstock/nginx.conf

El frontend de producción usa Nginx como servidor web ligero de alto rendimiento configurado para:

1. **Servir la SPA de React:** Devuelve el archivo index.html ante cualquier ruta no encontrada para que React Router funcione en producción (`try_files $uri $uri/ /index.html`).
2. **Evitar CORS (Proxy Reverso):** Redirige cualquier petición interna del frontend a `/api/...` hacia el contenedor del backend `http://backend:8080/api/` de forma invisible para el usuario.
3. **Compresión Gzip:** Reduce el tamaño de transferencia de los archivos JS, CSS y HTML antes de enviarlos al navegador, acelerando la velocidad de carga de la web.

---

## 3. Guía Paso a Paso para Simular Producción

Sigue estos pasos para compilar, levantar y analizar el sistema con configuración óptima de producción.

### Paso 1: Compilar y levantar la producción simulada

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker compose -p controlstock-prod --profile prod up --build -d
```

*Docker tardará un poco la primera vez porque compilará el código Java (etapa Maven) y empaquetará el frontend React en archivos estáticos utilizando NPM.*

### Paso 2: Verificar el estado de los contenedores

```bash
docker compose -p controlstock-prod ps
```

Deberías ver tres contenedores activos con el sufijo `-prod`:
* `controlstock-db-prod` (Puerto 5432 interno, expuesto como 5434 en el host)
* `controlstock-backend-prod` (Puerto 8081 expuesto al host)
* `controlstock-frontend-prod` (Puerto 80 expuesto al host)

### Paso 3: Probar el sistema en producción

1. Abre tu navegador e ingresa a: **[http://localhost](http://localhost)** (no necesitas especificar puerto ya que corre sobre el puerto HTTP por defecto `80`).
2. Interactúa con la página. El frontend se sirve de forma ultra rápida gracias a Nginx.
3. (Opcional) Si quieres ver la API directamente (Swagger), puedes acceder a: `http://localhost:8081/swagger-ui.html`.

### Paso 4: Detener y limpiar el entorno

Cuando termines de comprender esta configuración, detén los servicios. Si deseas liberar el espacio del volumen y base de datos simulada de producción:

```bash
docker compose -p controlstock-prod down -v
```

---


## 4. Ambos Entornos Simultáneamente

Puedes tener ambos entornos corriendo al mismo tiempo sin conflictos:

```bash
# Terminal 1: Desarrollo
docker compose -p controlstock-dev --profile dev up --build

# Terminal 2: Producción
docker compose -p controlstock-prod --profile prod up --build -d
```

Los nombres de proyecto, contenedores, redes y volúmenes son distintos para cada entorno, por lo que no hay interferencias.