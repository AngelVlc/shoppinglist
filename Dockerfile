FROM angelvlc/ionic-build as builder
WORKDIR $APP
COPY . $APP
RUN npm install \
  && npm rebuild node-sass \
  && ionic cordova build android --release