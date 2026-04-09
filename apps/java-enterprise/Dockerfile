FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /src
COPY apps/java-enterprise/pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline

COPY apps/java-enterprise/src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /src/target/java-enterprise-0.1.0.jar /app/app.jar

EXPOSE 4004
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
