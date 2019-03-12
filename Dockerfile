FROM angelvlc/ionic-build as builder
ARG KEYSTORE_PASSWORD
ENV APP=/app KEYSTORE_PASSWORD=$KEYSTORE_PASSWORD
WORKDIR $APP
COPY . $APP
RUN bash buildAndroid

FROM angelvlc/google-play-publish
ENV APP=/app GOOGLE_PLAY_APY_KEY_FILE_NAME=google_play_api_key.json
WORKDIR $APP
COPY --from=builder $APP/ShoppingList_release_signed.apk $APP/ShoppingList_release_signed.apk
COPY $GOOGLE_PLAY_APY_KEY_FILE_NAME $APP
ENV GOOGLE_APPLICATION_CREDENTIALS=$APP/$GOOGLE_PLAY_APY_KEY_FILE_NAME

CMD ["npm", "start", "/app/ShoppingList_release_signed.apk", "io.abh.shoppinglist"]