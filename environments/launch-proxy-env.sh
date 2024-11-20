#!/usr/bin/env bash

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

docker compose -f $SCRIPT_DIR/compose-proxy.yaml --env-file=$SCRIPT_DIR/compose-proxy.env build
docker compose -f $SCRIPT_DIR/compose-proxy.yaml --env-file=$SCRIPT_DIR/compose-proxy.env up