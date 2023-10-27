#!/bin/bash
set -e

docker rm node-healthcheck -f 2> /dev/null
docker rmi node-healthcheck:dev -f 2> /dev/null
