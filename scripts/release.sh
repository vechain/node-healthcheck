#!/bin/bash
set -e

if [ -z "$1" ]; then
    echo "Please provide the tag for the new build."
    exit 1
fi
tag=$1

aws ecr-public get-login-password --region us-east-1 --profile prod-node-devops | docker login --username AWS --password-stdin public.ecr.aws/vechainfoundation
docker buildx build --platform linux/amd64,linux/arm64/v8 -t public.ecr.aws/vechainfoundation/node-healthcheck:$tag --push .
docker buildx build --platform linux/amd64,linux/arm64/v8 -t public.ecr.aws/vechainfoundation/node-healthcheck:latest --push .
