# =============================================================================
# Dockerfile: Backend Spring Boot (Java 21 + Maven)
# Estrategia: Multi-stage Build para separar build de runtime
# =============================================================================

# ──────────────────────────────────────────────────────────────────────────────
# STAGE 1: Build  ---> Compila la aplicacion con Maven (incluye devtools)
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
# STAGE 2: Build (Prod)  ---> Compila para produccion (sin devtools)
# ──────────────────────────────────────────────────────────────────────────────
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder-prod

WORKDIR /build

# Copiar POM y descargar dependencias
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copiar codigo fuente
COPY src ./src

# Compilar con perfil de produccion (excluye devtools)
RUN mvn clean package -DskipTests -Pprod -B

# ──────────────────────────────────────────────────────────────────────────────
# STAGE 3: Dev  ---> Desarrollo con Hot Reload (spring-boot-devtools)
# ──────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:21.0.11_10-jre-jammy AS dev

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

EXPOSE 8080 5005 35729

ENTRYPOINT ["java", \
    "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", \
    "-Dspring.devtools.restart.enabled=true", \
    "-Dspring.devtools.livereload.enabled=true", \
    "-Dspring.devtools.restart.additional-paths=/app/target/classes", \
    "-jar", "/opt/app/app.jar"]

# ──────────────────────────────────────────────────────────────────────────────
# STAGE 4: Prod  ---> Produccion (imagen Alpine JRE ~170MB total)
# ──────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS prod

WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup -S spring && adduser -S spring -G spring

# Copiar el JAR (sin devtools) desde la etapa builder-prod
COPY --from=builder-prod /build/target/*.jar ./app.jar

# Asegurar permisos
RUN chown -R spring:spring /app

USER spring:spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]