#!/bin/bash

[ ! -d '/tmp/cache' ] && mkdir -p /tmp/cache

exec node ./apps/web/server.js
