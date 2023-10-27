#!/bin/bash
set -e

scripts_path="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $scripts_path
docker build -t node-healthcheck:dev ..