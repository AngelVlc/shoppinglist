FROM angelvlc/ionic-build as builder
ENV APP=/app
WORKDIR $APP

COPY package.json $APP
COPY package-lock.json $APP

RUN npm install

COPY . $APP
RUN npm rebuild node-sass
