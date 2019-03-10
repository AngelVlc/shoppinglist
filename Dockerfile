FROM angelvlc/ionic-build

ENV APP /app

# app
WORKDIR $APP
COPY . $APP

RUN npm install \
  && npm rebuild node-sass
