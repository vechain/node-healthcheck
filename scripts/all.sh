#!/bin/bash
set -e

scripts_path="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
"$scripts_path/clean.sh"
"$scripts_path/build.sh"
"$scripts_path/run.sh"
sleep 1
"$scripts_path/test.sh"