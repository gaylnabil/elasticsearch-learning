FROM openjdk:8-jdk-alpine

RUN apk add --no-cache curl tar bash

ARG JAR_FILE=target/*.jar

COPY ${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c"]

CMD ["curl -sSL https://github.com/elastic/elasticsearch/raw/master/bin/elasticsearch-keystore | bash -s add 'mykey' 'changeme' && \
    java -jar /app.jar"]