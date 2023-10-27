#!/bin/bash
set -e

retry_command() {
  local max_attempts=5
  local delay=3
  local attempt=0

  until [ $attempt -ge $max_attempts ]; do
    "$@"
    local exit_code=$?
    if [ $exit_code -eq 0 ]; then
      return 0
    fi

    attempt=$((attempt + 1))
    echo "Command failed (Attempt $attempt/$max_attempts). Retrying in $delay seconds..." >&2
    sleep "$delay"
  done

  echo "Command failed $max_attempts times. Giving up." >&2
}

response=$(retry_command curl -s http://localhost:11012/healthcheck)
is_healthy=$(echo $response | jq ".isHealthy")
if [ "$is_healthy" == "true" ]; then
    echo "Smoke test successful."
else
    echo "Smoke test failed."
fi
