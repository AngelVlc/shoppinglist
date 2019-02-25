FROM node:10.15.1-jessie

ENV APP /app/
ENV ANDROID /android-sdk/
ENV GRADLE /gradle/

# java
RUN echo "deb http://http.debian.net/debian jessie-backports main" | tee --append /etc/apt/sources.list.d/jessie-backports.list > /dev/null
RUN apt-get update
RUN apt-get install -y -t jessie-backports openjdk-8-jdk
RUN echo 'export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64' >> /etc/bash.bashrc
RUN echo 'export PATH=$PATH:/usr/lib/jvm/java-8-openjdk-amd64/bin' >> /etc/bash.bashrc

# android
WORKDIR $ANDROID
RUN wget https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip
RUN unzip sdk-tools-linux-4333796.zip
RUN echo 'export ANDROID_HOME=/android-sdk' >> /etc/bash.bashrc
RUN echo 'export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools' >> /etc/bash.bashrc
RUN yes | tools/bin/sdkmanager "platforms;android-28" "build-tools;28.0.3" "platform-tools" "tools"

# gradle
WORKDIR $GRADLE
RUN wget https://services.gradle.org/distributions/gradle-3.4.1-bin.zip
RUN unzip -d . gradle-3.4.1-bin.zip
RUN echo 'export PATH=$PATH:/gradle/gradle-3.4.1/bin' >> /etc/bash.bashrc

# ionic & cordova
RUN npm install -g ionic cordova
RUN cordova telemetry off

# app
WORKDIR $APP
COPY . $APP

RUN npm install
RUN ionic cordova platform add android