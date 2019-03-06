FROM angelvlc/ionic-build

ENV APP /app/

# app
WORKDIR $APP
COPY . $APP
