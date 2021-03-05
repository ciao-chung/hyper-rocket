#!/usr/bin/env bash

apt-get update
curl -sL https://deb.nodesource.com/setup_12.x | bash -
apt-get install nodejs -y
ln -s /usr/bin/nodejs /usr/bin/node
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
apt-get update
apt-get install yarn -y
apt-get install libnotify-bin -y
apt-get install notify-osd -y
apt-get install build-essential -y
npm -v
node -v
yarn --version
