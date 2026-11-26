#!/bin/bash

rm -rf ../node_modules/
rm -rf node_modules/
rm -rf ios/Pods/
yarn install
rm -rf node_modules/react-native-applifecycle/Sample/
rm -rf node_modules/react-native-applifecycle/.git/

npx -y pod-install
