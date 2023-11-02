#!/bin/bash
set -e

docker run -d \
    --name node-healthcheck \
    -p 11012:11012 \
    -e NODE_URL="https://sync-testnet.vechain.org" \
    node-healthcheck:dev
