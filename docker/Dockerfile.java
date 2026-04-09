# Deprecated: use apps/java-enterprise/Dockerfile from repo root context.
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /src
COPY apps/java-enterprise/pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline

COPY apps/java-enterprise/src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S spring && adduser -S spring -G spring
COPY --from=builder /src/target/java-enterprise-0.1.0.jar /app/app.jar
USER spring:spring
EXPOSE 4004
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
