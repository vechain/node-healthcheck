#!/bin/bash
set -e

scripts_path="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $scripts_path
docker buildx build --platform linux/amd64,linux/arm64/v8 -t node-healthcheck:dev ..
docker buildx build --load -t node-healthcheck:dev ..
