FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY backend/pom.xml .
RUN mvn -q -DskipTests dependency:go-offline
COPY backend/src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=production
ENV JAVA_OPTS="-Djava.security.egd=file:/dev/./urandom -Xmx512m"
COPY --from=build /app/target/travel-app-*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]

