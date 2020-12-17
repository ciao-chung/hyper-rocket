#!/usr/bin/env bash
yarn global add /hyper-rocket
hyper-rocket php:install 7.4 -x --base --composerVersion=1.10.1
hyper-rocket mysql:install-server 5.7 -x -p pw
hyper-rocket phpfpm:install 7.4 -x
hyper-rocket phpfpm:test -x
hyper-rocket phpfpm:restart -x
hyper-rocket phpmyadmin -x --phpIni=/etc/php/7.4/cli/php.ini -p pw
