#!/bin/bash

echo 'Capacitor sync'
npx cap sync

cd android
echo 'gradlew bundleRelease'
./gradlew bundleRelease