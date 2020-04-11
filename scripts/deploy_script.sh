#!/bin/bash
openssl aes-256-cbc -K $encrypted_61627df7c213_key -iv $encrypted_61627df7c213_iv -in google_files.tar.enc -out google_files.tar -d
tar xvf google_files.tar
docker build -t shoppinglist --build-arg KEYSTORE_PASSWORD=$KEYSTORE_PASSWORD -f Dockerfile.deploy .
docker run shoppinglist
