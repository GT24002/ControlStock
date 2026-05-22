# ControlStock

## 👥 Equipo — Grupo 5

| Nombre | Carnet |
|--------|--------|
| Kevin Roberto Gomez Tobar   | GT24002 |
| Rafael Armando Ibañez Diego | ID24001 |
| Yohalmo Alonso Castro Siguenza | CS24009 |
| Brayan Alexander Villalta Gutierrez| VG24003 |
| Mynor Ivan Carias Martinez |CM23138|


## Dockerizacion del proyecto

Para entender la arquitectura, levantar los entornos y comprender el funcionamiento de Docker en esta aplicación, disponemos de las siguientes guías técnicas detalladas:

### 1. Guía de Inicio Rápido
* **Archivo:** [DOCKER_GETTING_STARTED.md](docker_docs/DOCKER_GETTING_STARTED.md)
<br>Cómo empezar a programar en el día a día. Explica el **Modo Híbrido** (base de datos en Docker y código corriendo localmente en IntelliJ/VSCode Vite) y el **Modo Todo-en-Docker** para levantar el sistema completo con un solo comando.

### 2. Sustento Técnico de Desarrollo (Docker Dev)
* **Archivo:** [docker-dev-setup.md](docker_docs/docker-dev-setup.md)
<br>La arquitectura técnica de desarrollo **Modo Todo-en-Docker**. Explica detalladamente cómo se logra el *Hot Reload* en Java y React dentro de contenedores usando *bind mounts*, caché persistente de dependencias y *polling* de archivos para solucionar bloqueos en Windows/WSL.

### 3. Simulación de Producción y Optimización
* **Archivo:** [DOCKER_PROD_GUIDE.md](docker_docs/DOCKER_PROD_GUIDE.md)
<br>Cómo se optimiza la aplicación para el mundo real. Explica la arquitectura de **Multi-stage Builds**, el uso del servidor **Nginx** de alto rendimiento sirviendo estáticos, la prevención de errores de CORS mediante **Proxy Reverso**, y el uso seguro de validación de base de datos.

### 4. Inicialización de Base de Datos
> <b><i>OPCIONAL: Esto se hace solo si no tienes docker instalado, o si quieres recrear la base de datos.</i></b>
* **Archivo:** [DB_README.md](database/DB_README.md)
<br>Pasos detallados para recrear la base de datos de PostgreSQL e inicializar los scripts con la carga semilla de datos iniciales.
