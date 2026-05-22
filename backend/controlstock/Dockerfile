# =============================================================================
# Dockerfile: Backend Spring Boot (Java 21 + Maven)
# Estrategia: Multi-stage Build para separar build de runtime
# =============================================================================

# ──────────────────────────────────────────────────────────────────────────────
# STAGE 1: Build  ---> Compila la aplicacion con Maven
# ──────────────────────────────────────────────────────────────────────────────
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# 1. Copiar solo los archivos de configuracion de Maven y el POM
#    (Esto aprovecha la cache de capas de Docker: mientras el POM no cambie,
#     las dependencias se descargan una sola vez)
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# 2. Copiar el codigo fuente completo
COPY src ./src

# 3. Compilar y empaquetar (genera el JAR sin los tests)
RUN mvn clean package -DskipTests -B

# ──────────────────────────────────────────────────────────────────────────────
# STAGE 2: Dev  ---> Desarrollo con Hot Reload (spring-boot-devtools)
# ──────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:21.0.11_10-jre-jammy AS dev

# El JAR se copia a /opt/app/ para que no sea sobrescrito por el bind mount
# El codigo fuente se monta en /app/ via bind mount (para DevTools)
WORKDIR /opt/app

# Instalar herramientas necesarias para desarrollo
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar el JAR desde la etapa builder a /opt/app/
COPY --from=builder /build/target/*.jar ./app.jar

# Crear directorio /app/src para el bind mount del codigo fuente
# (DevTools monitorea /app/src para detectar cambios)
RUN mkdir -p /app/src

# Exponer puertos:
#   8080 - Aplicacion Spring Boot
#   5005 - JDWP (depuracion remota)
#   35729 - LiveReload (spring-boot-devtools)
EXPOSE 8080 5005 35729

# Punto de entrada: ejecuta la app con DevTools y JDWP activados
# El JAR esta en /opt/app/app.jar (no en /app/, que es donde va el bind mount)
# DevTools monitorea /app/target/classes para cambios en el classpath compilado
# (IntelliJ escribe los .class compilados en target/classes/ del host,
#  y el bind mount ./backend/controlstock:/app los expone en el contenedor)
ENTRYPOINT ["java", \
    "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", \
    "-Dspring.devtools.restart.enabled=true", \
    "-Dspring.devtools.livereload.enabled=true", \
    "-Dspring.devtools.restart.additional-paths=/app/target/classes", \
    "-jar", "/opt/app/app.jar"]

# ──────────────────────────────────────────────────────────────────────────────
# STAGE 3: Prod  ---> Produccion (sin herramientas de desarrollo)
# ──────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:21.0.11_10-jre-jammy AS prod

WORKDIR /app

# Copiar el JAR desde la etapa builder
COPY --from=builder /build/target/*.jar ./app.jar

EXPOSE 8080

# En produccion NO se incluye DevTools ni JDWP
ENTRYPOINT ["java", "-jar", "app.jar"]