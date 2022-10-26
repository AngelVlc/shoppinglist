#!/bin/bash

echo 'Capacitor sync'
npx cap sync

cd android
echo 'gradlew assembleDebug'
./gradlew assembleDebug