#!/bin/bash

echo 'Ionic build'
ionic build

echo 'Capacitor sync'
npx cap sync

cd android
echo 'gradlew assembleDebug'
./gradlew assembleDebug