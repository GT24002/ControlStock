# Guía de Contenedores en Producción (Simulación)

Esta documentación técnica explica cómo simular y entender un entorno de **producción real** en tu propia máquina utilizando **Docker Compose** y la estrategia de **Multi-stage Builds** (Construcción Multietapa) implementada en el proyecto.

---

## 1. Arquitectura de Producción vs Desarrollo

En desarrollo utilizamos herramientas para la comodidad del programador (reinicio rápido, compiladores y depuración). En producción, eliminamos todo el "ruido" para lograr la máxima velocidad, seguridad y ligereza.

```
                  ENTORNO DE PRODUCCIÓN (docker-compose.prod.yml)
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

## 2. Los Nuevos Archivos Agregados

### 2.1 docker-compose.prod.yml
Este archivo orquesta el despliegue con estándares de producción:
* **`target: prod`**: Indica a Docker que compile las imágenes usando únicamente las etapas finales (`prod`) definidas en los `Dockerfile`.
* **Sin Bind Mounts**: Ya no vincula carpetas locales de código. Si cambias un archivo en tu editor local, no se reflejará dentro del contenedor hasta que vuelvas a compilar. Esto garantiza la inmutabilidad y seguridad del contenedor.
* **Red y Volúmenes Aislados**: Usa la red `controlstock_network_prod` y el volumen de base de datos `controlstock_pgdata_prod` para evitar sobrescribir tus datos de desarrollo local.
* **Validación de Base de Datos**: El backend usa `SPRING_JPA_HIBERNATE_DDL_AUTO: validate` en lugar de `update`. En producción, nunca permitimos que Hibernate cree o altere tablas automáticamente, sino que validamos que el esquema coincida.

### 2.2 frontend/controlstock/nginx.conf
Un servidor web ligero de alto rendimiento configurado para:
1. **Servir la SPA de React:** Devuelve el archivo index.html ante cualquier ruta no encontrada para que React Router funcione en producción (`try_files $uri $uri/ /index.html`).
2. **Evitar CORS (Proxy Reverso):** Redirige cualquier petición interna del frontend a `/api/...` hacia el contenedor del backend `http://backend:8080/api/` de forma invisible para el usuario.
3. **Compresión Gzip:** Reduce el tamaño de transferencia de los archivos JS, CSS y HTML antes de enviarlos al navegador, acelerando la velocidad de carga de la web.

---

## 3. Guía Paso a Paso para la Simulación

Sigue estos pasos para compilar, levantar y analizar el sistema con configuración óptima de producción.

### Paso 1: Compilar y levantar la producción simulada
Ejecuta el siguiente comando en la raíz del proyecto para iniciar la compilación y encendido en segundo plano:
```bash
docker compose -f docker-compose.prod.yml up --build -d
```
*Docker tardará un poco la primera vez porque compilará el código Java (etapa Maven) y empaquetará el frontend React en archivos estáticos utilizando NPM.*

### Paso 2: Verificar el estado de los contenedores
```bash
docker compose -f docker-compose.prod.yml ps
```
Deberías ver tres contenedores activos con el sufijo `-prod-container`:
* `controlstock-db-prod-container` (Puerto 5432 expuesto internamente)
* `controlstock-backend-prod-container` (Puerto 8080 expuesto)
* `controlstock-frontend-prod-container` (Puerto 80 expuesto al host)

### Paso 3: Probar el sistema en producción
1. Abre tu navegador e ingresa a: **[http://localhost](http://localhost)** (no necesitas especificar puerto ya que corre sobre el puerto HTTP por defecto `80`).
2. Interactúa con la página. El frontend se sirve de forma ultra rápida gracias a Nginx.
3. (Opcional) Si quieres ver la API directamente (Swagger), puedes acceder a: `http://localhost:8081/swagger-ui.html`.

### Paso 4: Detener y limpiar el entorno
Cuando termines de comprender esta configuración, detén los servicios. Si deseas liberar el espacio del volumen y base de datos simulada de producción:
```bash
docker compose -f docker-compose.prod.yml down -v
```

---

## 4. Comparativa Técnica (Dev vs Prod)


| Concepto | Desarrollo (Modo Híbrido o Docker-Dev) | Producción (`docker-compose.prod.yml`) |
| :--- | :--- | :--- |
| **Servidor Frontend** | Servidor de desarrollo Vite (`npm run dev`) en puerto `5173`. | Servidor web **Nginx** sirviendo HTML/JS plano en puerto `80`. |
| **Tamaño Frontend** | ~400 MB (incluye `node_modules`, código TypeScript y Vite). | ~25 MB (solo Nginx y el código compilado a Vanilla JS en `/dist`). |
| **Depuración Java** | Puerto `5005` abierto listo para interceptar breakpoints. | Puerto `5005` cerrado por seguridad. |
| **Reinicio Automático** | Activado (Spring DevTools / Vite HMR con polling). | Desactivado. El contenedor es inmutable. |
| **Políticas de Datos** | `update` (Crea o altera tablas según el código Java). | `validate` (Si la base de datos no coincide exactamente con el código, falla el arranque). |

---

### Experimentar:
1. Modifica algún texto en `frontend/controlstock/src/pages/dashboard/Dashboard.tsx` y guarda el archivo.
2. Abre `http://localhost` (producción) y verás que **el cambio no aparece**.
3. Ejecuta `docker compose -f docker-compose.prod.yml up --build -d` para reconstruir la imagen de producción.
4. Recarga la página y verás tu cambio reflejado. 

*Esto nos enseña de forma práctica el concepto de **inmutabilidad de contenedores en producción**, un pilar fundamental de la filosofía DevOps.*
