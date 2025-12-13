# ---- Base image ----
FROM eclipse-temurin:17-jdk-jammy


# ---- App directory inside container ----
WORKDIR /app

# ---- Copy jar (Render will build it) ----
COPY target/*.jar app.jar

# ---- Expose Spring Boot port ----
EXPOSE 8080

# ---- Run app ----
ENTRYPOINT ["java", "-jar", "app.jar"]
