# =============================================================================
# Dockerfile: Backend Spring Boot (Java 21 + Maven)
# =============================================================================
# Estrategia: Multi-stage Build (Construccion Multietapa)
#
# Este Dockerfile produce UNA SOLA imagen final optimizada para produccion.
# La misma imagen se usa tanto en desarrollo como en produccion; la unica
# diferencia es la URL de conexion a la base de datos, que se configura
# mediante variables de entorno en docker-compose.yml.
#
# Etapas (stages):
#   1. builder  → Compila el JAR con Maven
#   2. final    → Runtime de produccion (Alpine JRE, usuario no-root)
#
# Beneficios del multi-stage:
#   - La etapa builder usa una imagen Maven pesada (~700MB), pero SOLO
#     durante el build; la etapa final usa JRE Alpine ligero (~170MB)
#   - Cache de capas: mientras pom.xml no cambie, las dependencias de
#     Maven se reutilizan entre reconstrucciones
# =============================================================================


# =============================================================================
# STAGE 1: builder  ---> Compila el JAR con Maven
# =============================================================================
# Proposito: Compilar el codigo fuente de la aplicacion en un JAR ejecutable.
#
# Cache de capas:
#   1. COPY pom.xml + RUN mvn dependency:go-offline
#      → Se almacena en cache MIENTRAS pom.xml no cambie
#   2. COPY src + RUN mvn package
#      → Solo se re-ejecuta si el codigo fuente cambia
# =============================================================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Copiar SOLO el POM para aprovechar la cache de dependencias
COPY pom.xml ./

# Descargar todas las dependencias offline (sin compilar aun)
RUN mvn dependency:go-offline -B

# Copiar el codigo fuente completo
COPY src ./src

# Compilar y empaquetar en un JAR ejecutable
RUN mvn clean package -DskipTests -B


# =============================================================================
# STAGE 2: final  ---> Runtime de produccion (unica imagen)
# =============================================================================
# Proposito: Imagen unica para desarrollo y produccion.
#
# Caracteristicas:
#   - JRE Alpine: imagen ligera (~170MB)
#   - Usuario no-root: mejores practicas de seguridad
#   - Sin DevTools ni JDWP (innecesarios sin bind mounts)
#   - La conexion a BD se configura por variable de entorno
# =============================================================================
FROM eclipse-temurin:21-jre-alpine AS final

WORKDIR /app

# Crear usuario y grupo no-root para ejecutar la aplicacion con
# permisos limitados (seguridad: si el contenedor es comprometido,
# el atacante no tiene permisos de root)
RUN addgroup -S spring && adduser -S spring -G spring

# Copiar el JAR desde la etapa builder
COPY --from=builder /build/target/*.jar ./app.jar

# Asignar permisos al usuario spring sobre /app
RUN chown -R spring:spring /app

# Ejecutar como usuario no-root
USER spring:spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]