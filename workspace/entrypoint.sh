#!/usr/bin/env bash
service ssh restart
cat /root/.ssh/id_rsa.pub >> /root/.ssh/authorized_keys
tail -f /dev/null
