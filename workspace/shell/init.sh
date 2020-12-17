#!/usr/bin/env bash
yarn global add /hyper-rocket
hyper-rocket php:install 7.1 -x --all --composerVersion=1.10.1 --removeApache
hyper-rocket mysql:db-create laravel -x -p pw
hyper-rocket mysql:install-server 5.7 -x -p pw
hyper-rocket phpfpm:install 7.1 -x
hyper-rocket phpfpm:test -x
hyper-rocket phpfpm:restart -x
hyper-rocket nginx:install -x
hyper-rocket nginx:install -x --phpfpm 7.1
yarn global add pm2
