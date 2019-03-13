FROM angelvlc/ionic-build as builder
ENV APP=/app
WORKDIR $APP
COPY . $APP
RUN npm install \
  && npm rebuild node-sass \
  && ionic cordova build android --release