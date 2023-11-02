#!/bin/bash
set -e

scripts_path="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $scripts_path
./clean.sh
./build.sh
./run.sh
sleep 1
./test.sh