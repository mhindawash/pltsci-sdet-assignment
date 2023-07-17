FROM openjdk:8u141-jdk

ENV APPLICATION_FILE sdet-assignment-service-0.0.1-SNAPSHOT.jar

# Set the location of the app
ENV APPLICATION_HOME /usr/local/demo-app

EXPOSE 8080

# Copy your fat jar to the container
COPY $APPLICATION_FILE $APPLICATION_HOME/
COPY run.sh /bin/

COPY application.properties /

# Launch the APPLICATION
WORKDIR $APPLICATION_HOME
CMD ["run.sh"]
